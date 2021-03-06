import { IpcRenderer, BrowserWindow } from 'electron';
import { ApiFormat, EventBus, BaseResponse, ApiStatus } from '@elizer/shared';

// const REQUEST_TIME_OUT = 2000;
const REQUEST_TIME_OUT = 200000;

const ipc: IpcRenderer = (window as any).require('electron').ipcRenderer;

export function renderEventBus<T extends BaseResponse>(
  ctx: ApiFormat<any, any>,
): Promise<T> {
  ipc.send(EventBus.Request, ctx);
  console.log(ctx);
  return new Promise((resolve, rejects) => {
      ipc.on(EventBus.Response, (event: Event, response: T) => {
        if (response.reqId === ctx.id) {
          return resolve(response);
        }
      });
      setTimeout(
        () => rejects(responeTimeoutError(ctx)),
        REQUEST_TIME_OUT - 200,
      );
    // tslint:disable-next-line:align
  });
}

interface ResponseError extends BaseResponse {
  error: string;
}

function responeTimeoutError(ctx: ApiFormat<any, any>): ResponseError {
  return {
    reqId: ctx.id,
    status: ApiStatus.Failure,
    time: Date.now(),
    error: `Api Response Time Out Eludeded`,
  };
}
