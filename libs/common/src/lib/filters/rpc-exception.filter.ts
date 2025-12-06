/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { RpcException } from "@nestjs/microservices";
import { ValidationError } from "../decorators";
import { status } from "@grpc/grpc-js";
import { DomainException } from "../exceptions";

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter {
    catch (exception: any, host: ArgumentsHost): Observable<any> {
        if (exception instanceof RpcException) {
          const err = exception.getError() as any;

          return throwError(() => ({
            code: err.code ?? status.UNKNOWN,
            message: err.message ?? 'RPC Error',
            details: err.details ?? null,
          }));
        }

        if (exception instanceof ValidationError) {
            return throwError(() => {
              return {
                code: status.INVALID_ARGUMENT,
                details: exception.message,
              }  
            })
        }

        if (exception instanceof DomainException) {
            return throwError(() => {
              return {
                code: exception.statusCode,
                details: exception.message,
                domain: exception.domainName,
                errorName: exception.name,
              }  
            })
        }

        if (exception instanceof Error) {
            return throwError(() => ({
                code: status.INTERNAL,
                details: exception.message,
            }))
        }

        return throwError(() => ({
            code: status.UNKNOWN,
            message: "Unknown gRPC error"
        }))
    }
}