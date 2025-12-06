import { Observable } from "rxjs";
import { firstValueFrom } from "rxjs";
import { handleGrpcError } from "./grpc-error.handler";

export async function grpcWrapper<T>(fn: () => Observable<T>) {
    try {
        return await firstValueFrom(fn());
    } catch (error) {
        handleGrpcError(error);
    }
}