import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class ThrowError {
  static notFound(message: string): NotFoundException {
    throw new NotFoundException(message);
  }

  static internalServer(): InternalServerErrorException {
    throw new InternalServerErrorException();
  }

  static conflict(message: string): ConflictException {
    throw new ConflictException(message);
  }
}
