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
            return throwError(() => exception.getError())
        }

        if (exception instanceof ValidationError) {
            return throwError(() => {
              return {
                code: status.INVALID_ARGUMENT,
                message: exception.message,
              }  
            })
        }

        if (exception instanceof DomainException) {
            return throwError(() => {
              return {
                code: exception.statusCode,
                message: exception.message,
                domain: exception.domainName,
                errorName: exception.name,
              }  
            })
        }

        if (exception instanceof Error) {
            return throwError(() => ({
                code: status.INTERNAL,
                message: exception.message,
            }))
        }

        return throwError(() => ({
            code: status.UNKNOWN,
            message: "Unknown gRPC error"
        }))
    }
}