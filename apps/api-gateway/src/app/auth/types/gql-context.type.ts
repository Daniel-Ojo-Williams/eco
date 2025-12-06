import { Request, Response } from "express";
import { TokenPayload } from "@eco/common";

export interface GqlContext {
    req: Request;
    res: Response;
    user: TokenPayload;
}