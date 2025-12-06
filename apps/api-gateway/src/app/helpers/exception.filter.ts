import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = exception.getResponse() as any;
    const status = exception.getStatus();

    // Map HTTP status to GraphQL error code
    const errorCode = this.getErrorCode(status);

    // Format error message
    let message = typeof response === 'string' 
      ? response 
      : response.message || exception.message;

    if (status === 500) {
        message = "An error occurred";
    }

    // Return GraphQL error format
    return new GraphQLError(message, {
      extensions: {
        code: errorCode,
        statusCode: status,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private getErrorCode(status: number): string {
    const errorCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHENTICATED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };

    return errorCodes[status] || 'INTERNAL_SERVER_ERROR';
  }
}