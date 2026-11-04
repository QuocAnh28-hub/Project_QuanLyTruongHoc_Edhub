import { AppError, AppValidationException } from '@gedu/shared/errors';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SCHOOL_YEAR_STATUS, STATUS } from '@gedu/shared/enums';
import {
  cryptString,
  generateSecurePassword,
  verifyPassword,
} from '@gedu/shared';

import { EmailService } from '@gedu/email';
import { JwtPayload } from './strategies/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@gedu/prisma';
import { PROVINCE_CONFIG_KEY, ProvinceConfig } from '@gedu/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly STUDENT_CONTACT_ORG_ID = 2;
  /**
   * Creates an instance of AuthService.
   * @param prisma - The Prisma service for database operations
   * @param jwtService - The JWT service for token generation
   * @param emailService - The Email service for sending emails
   * @param provinceConfig - The province configuration
   */
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @Inject(PROVINCE_CONFIG_KEY)
    private readonly provinceConfig: ProvinceConfig
  ) {}

  async validateUser(email: string, password: string) {
    const account = await this.prisma.account.findFirst({
      where: { userName: email },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            schoolStaff: {
              include: {
                school: {
                  select: {
                    name: true,
                    code: true,
                    canPreschool: true,
                    canPrimarySchool: true,
                    canLowerSecondarySchool: true,
                    canUpperSecondarySchool: true,
                    schoolYears: {
                      where: {
                        status: SCHOOL_YEAR_STATUS.ACTIVE,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!account) {
      throw new AppError(AppValidationException.INVALID_ACCOUNT_OR_PASSWORD);
    }
    // If account is not belong to DOET, check if account is active

    const isPasswordValid = await verifyPassword(
      password,
      account.password ?? '',
    );

    if (!isPasswordValid) {
      throw new AppError(AppValidationException.INVALID_ACCOUNT_OR_PASSWORD);
    }

    const { password: _, ...result } = account;
    return result;
  }

  /**
   * Attempts login and returns JWT with user profile metadata.
   * @throws AppError when credentials are invalid
   */

  async login(email: string, password: string) {
    const account = await this.validateUser(email, password);
    let schoolPositions = null;
    let refId = null;
    // const
    const provinceId = this.provinceConfig.id
    if (!provinceId || provinceId <= 0) {
      throw new AppError(AppValidationException.INVALID_PROVINCE_ID);
    }

    if (!account?.user) {
      throw new AppError(AppValidationException.INVALID_ACCOUNT_OR_PASSWORD);
    }

    const payload: JwtPayload = {
      sub: account.userId,
      email: account.userName,
      id: account.userId,
      orgId: account.orgId,
    };

    if (account.user.schoolStaff?.positionId) {
      schoolPositions = await this.prisma.schoolPositionTemplates.findFirst({
        select: {
          title: true,
          department: true,
        },
        where: {
          id: account.user.schoolStaff.positionId,
        },
      });
    }

    if (account.orgId === this.STUDENT_CONTACT_ORG_ID) {
      const studentContact = await this.prisma.studentsContact.findFirst({
        where: {
          userId: account.userId,
        },
      });
      refId = studentContact?.id || null;
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: account.userId,
        email: account.userName,
        firstName: account?.user.firstName,
        lastName: account?.user.lastName,
        orgId: account.orgId,
        positionTitle: schoolPositions?.title,
        roles: account.roles,
        departmentName: schoolPositions?.department?.name,
        refId,
        additional: {
          schoolYear:
            account.user.schoolStaff?.school?.schoolYears?.[0]?.id ?? null,
          schoolYearName:
            account.user.schoolStaff?.school?.schoolYears?.[0]?.title ?? null,
          provinceId,
          schoolName: account.user.schoolStaff?.school?.name ?? null,
          schoolCode: account.user.schoolStaff?.school?.code ?? null,
          canPreschool: account.user.schoolStaff?.school?.canPreschool ?? false,
          canPrimarySchool:
            account.user.schoolStaff?.school?.canPrimarySchool ?? false,
          canLowerSecondarySchool:
            account.user.schoolStaff?.school?.canLowerSecondarySchool ?? false,
          canUpperSecondarySchool:
            account.user.schoolStaff?.school?.canUpperSecondarySchool ?? false,
        },
      },
    };
  }

  /**
   * Returns account info and runtime metadata (e.g., provinceId).
   * @throws AppError when account is not found
   */
  async getAccountInfo(id: number, orgId: number) {
    let schoolPositions = null;
    const provinceId = this.provinceConfig.id;
    if (!provinceId || provinceId <= 0) {
      throw new AppError(AppValidationException.INVALID_PROVINCE_ID);
    }
    
    let refId = null;

    const account = await this.prisma.account.findFirst({
      where: {
        user: {
          id: id,
          orgId: orgId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            schoolStaff: {
              include: {
                school: {
                  select: {
                    name: true,
                    code: true,
                    canPreschool: true,
                    canPrimarySchool: true,
                    canLowerSecondarySchool: true,
                    canUpperSecondarySchool: true,
                    schoolYears: {
                      where: {
                        status: SCHOOL_YEAR_STATUS.ACTIVE,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!account) {
      throw new AppError(AppValidationException.INVALID_ACCOUNT);
    }

    if (account.user.schoolStaff?.positionId) {
      schoolPositions = await this.prisma.schoolPositionTemplates.findFirst({
        select: {
          title: true,
          department: true,
        },
        where: {
          id: account.user.schoolStaff.positionId,
        },
      });
    }

    if (account.orgId == this.STUDENT_CONTACT_ORG_ID) {
      const studentContact = await this.prisma.studentsContact.findFirst({
        where: {
          userId: account.userId,
        },
      });
      refId = studentContact?.id || null;
    }

    return {
      id: account.userId,
      firstName: account.user?.firstName,
      lastName: account.user?.lastName,
      phone: account.user?.phone,
      orgId: account.orgId,
      email: account.userName,
      positionTitle: schoolPositions?.title,
      departmentName: schoolPositions?.department?.name,
      roles: account.roles,
      refId,
      additional: {
        schoolYear:
          account.user.schoolStaff?.school?.schoolYears?.[0]?.id ?? null,
        schoolYearName:
          account.user.schoolStaff?.school?.schoolYears?.[0]?.title ?? null,
        provinceId,
        schoolName: account.user.schoolStaff?.school?.name ?? null,
        schoolCode: account.user.schoolStaff?.school?.code ?? null,
        canPreschool: account.user.schoolStaff?.school?.canPreschool ?? false,
        canPrimarySchool:
          account.user.schoolStaff?.school?.canPrimarySchool ?? false,
        canLowerSecondarySchool:
          account.user.schoolStaff?.school?.canLowerSecondarySchool ?? false,
        canUpperSecondarySchool:
          account.user.schoolStaff?.school?.canUpperSecondarySchool ?? false,
      },
    };
  }

  /**
   * Sends password reset email to user.
   * @param email - The user's email address
   * @returns Success message
   */
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
      include: {
        account: true,
      },
    });

    if (!user || !user.email) {
      return {
        message:
          'If the email exists, password reset instructions will be sent.',
      };
    }

    const newPassword = generateSecurePassword();
    const hashedPassword = await cryptString(newPassword);

    await this.prisma.account.update({
      where: { userName: email },
      data: { password: hashedPassword },
    });

    (async () => {
      const email = user.email;
      if (!email) {
        this.logger.warn(
          `User with ID ${user.id} has no email, skipping password reset email.`,
        );
        return;
      }
      const result = await this.emailService.sendResetPasswordEmail(email, {
        staffName: `${user.firstName} ${user.lastName}`,
        username: user.email!,
        password: newPassword,
      });
      if (result) {
        this.logger.log(`Reset password email sent to ${user.email}`);
      } else {
        this.logger.error(
          `Failed to send reset password email to ${user.email}`,
        );
      }
    })();

    return true;
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });

    if (!user || !user.account) {
      throw new AppError(AppValidationException.INVALID_ACCOUNT_OR_PASSWORD);
    }

    const isMatched = await verifyPassword(
      oldPassword,
      user.account.password ?? '',
    );
    if (!isMatched) {
      throw new AppError(AppValidationException.INVALID_PASSWORD);
    }

    const hashed = await cryptString(newPassword);

    await this.prisma.account.update({
      where: { id: user.account.id },
      data: {
        password: hashed,
        updatedAt: new Date(),
      },
    });

    (async () => {
      const email = user.email;
      if (!email) {
        this.logger.warn(
          `User with ID ${user.id} has no email, skipping password changed email.`,
        );
        return;
      }
      const result = await this.emailService.sendChangePasswordResultEmail(
        email,
        { staffName: `${user.firstName} ${user.lastName}` },
      );
      if (result) {
        this.logger.log(`Change password email sent to ${user.email}`);
      } else {
        this.logger.error(
          `Failed to send change password email to ${user.email}`,
        );
      }
    })();

    return { message: 'Password changed successfully' };
  }
}
