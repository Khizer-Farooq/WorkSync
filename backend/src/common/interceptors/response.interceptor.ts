import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const hasDataProperty =
          data &&
          typeof data === 'object' &&
          Object.prototype.hasOwnProperty.call(data, 'data');

        return {
          success: true,
          statusCode: 200,
          message: data?.message || 'Request successful',
          data: hasDataProperty ? data.data : data,
        };
      }),
    );
  }
}
