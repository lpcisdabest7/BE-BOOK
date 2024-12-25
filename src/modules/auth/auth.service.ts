import { HttpStatus, Injectable } from '@nestjs/common';
import { UserSSODto } from './dto/user-sso.dto';
import { AccountSignInDto } from './dto/account-sign-in.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ApiException } from 'src/utils/exception';
import { JwtService } from 'src/core/jwt/jwt.service';
import { validateHash } from 'src/utils/util';
import { initializeApp, credential, ServiceAccount } from 'firebase-admin';
import { UserSignUpDto } from './dto/user-register.dto';
import { Identify } from 'src/utils/type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signInAccount(dto: AccountSignInDto) {
    const account = await this.prismaService.account.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!account) {
      throw new ApiException('Not found account.', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await validateHash(dto.password, account?.password);

    if (!isPasswordValid) {
      throw new ApiException('Not found account.', HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtService.createPairToken({
      id: account.id,
      refer: 'account',
    });

    return {
      token,
      user: account,
    };
  }

  async signUpUser(dto: UserSignUpDto) {
    const loginMethod = await this.prismaService.loginMethod.findFirst({
      where: {
        provider: 'device',
        providerId: dto.referId,
      },
      include: {
        User: true,
      },
    });

    const application = await this.prismaService.application.findFirstOrThrow({
      where: {
        code: dto.applicationCode,
        isActive: true,
      },
    });

    let user;
    if (!loginMethod) {
      user = await this.prismaService.user.create({
        data: {
          applicationId: application.id,
          LoginMethod: {
            create: {
              provider: 'device',
              providerId: dto.referId,
            },
          },
        },
      });
    } else {
      user = loginMethod.User;
    }

    const token = await this.jwtService.createPairToken({
      id: user.id,
      refer: 'user',
    });

    return {
      token,
      user,
    };
  }

  async signInUserBySSO(dto: UserSSODto) {
    const application = await this.prismaService.application.findFirstOrThrow({
      where: {
        code: dto.applicationCode,
      },
    });

    if (!application.serviceAccount) {
      throw new ApiException(
        'ServiceAccount not found.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const app = initializeApp(
      {
        credential: credential.cert(<ServiceAccount>application.serviceAccount),
      },
      application.id,
    );

    try {
      return await this.prismaService.$transaction(async (tx) => {
        const socialUser = await app.auth().verifyIdToken(dto.idToken);
        const loginMethod = await tx.loginMethod.findFirst({
          where: {
            providerId: socialUser.sub,
            provider: 'firebase',
          },
          include: {
            User: true,
          },
        });

        let user;

        // Means user never login SSO before then create user
        if (!loginMethod) {
          user = await tx.loginMethod.create({
            data: {
              providerId: socialUser.sub,
              provider: 'firebase',
              User: {
                create: {
                  name: socialUser.email?.split('@')[0],
                  email: socialUser.email!,
                  applicationId: application.id,
                },
              },
            },
          });
        } else {
          // If dto has referId then sync account
          if (dto.referId) {
            const loginMethod2 = await tx.loginMethod.findFirst({
              where: {
                provider: 'device',
                providerId: dto.referId,
              },
              include: {
                User: true,
              },
            });

            if (loginMethod2) {
              // Sync data of user1 to user2
              const user1 = loginMethod.User;
              const user2 = loginMethod2.User;

              if (user1.id !== user2.id) {
                // Step 1 Sync all data
                await tx.bot.updateMany({
                  where: {
                    userId: user1.id,
                  },
                  data: {
                    userId: user2.id,
                  },
                });

                await tx.botMessage.updateMany({
                  where: {
                    userId: user1.id,
                  },
                  data: {
                    userId: user2.id,
                  },
                });

                // Step 2 Sync login method
                await tx.loginMethod.update({
                  where: {
                    id: loginMethod.id,
                  },
                  data: {
                    userId: user2.id,
                  },
                });
              }

              user = user2;
            } else {
              user = loginMethod.User;
            }
          } else {
            user = loginMethod.User;
          }
        }

        const token = await this.jwtService.createPairToken({
          id: user.id,
          refer: 'user',
        });

        app.delete();

        return {
          token,
          user,
        };
      });
    } catch (error) {}
  }

  async refreshToken(data: Identify) {
    if (data.id.startsWith('acc_')) {
      return await this.jwtService.createPairToken({
        id: data.id,
        refer: 'account',
      });
    }
    return await this.jwtService.createPairToken({
      id: data.id,
      refer: 'user',
    });
  }
}
