import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {map, shareReplay, tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public indexes$!: Observable<any>;
  constructor(private socket: Socket) {
    this.socket.emit('lee',console.log("lee"))
  }

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data:any) => data));
  }

}


