import { Chat } from '../../../../shared/model/chat.model';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import io from 'socket.io-client';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private api:ApiService) { }

  socket = io('http://localhost:3000/');// URL where  the server is running


  joinRoom(data: any){
    this.socket.emit('join', data)
  }

  newUserJoined(){
    let observable = new Observable<{user:String, chat:string}>((observer:any)=>{
      this.socket.on('userJoined', (data:any)=>{
        observer.next(data);
      });
      return() =>{ this.socket.disconnect();}
    })
    return observable;
  }
  leaveRoom(data: { user: String; room: String; }){
this.socket.emit('leave', data);
  }

  userLeftRoom(){
    let observable = new Observable<{user:String, chat:String}>(observer=>{
      this.socket.on('left-room', (data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;
  }

  sendMessage(data: any)
  {
    this.socket.emit('message',data);
  }
  newMessageReceived(){
    let observable = new Observable<{user:String, chat:String}>(observer=>{
      this.socket.on('new-message', (data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;
  }
  createMessage(chat:Chat){
    return this.api.post<{data: Chat}>('create-message', chat).pipe(map(res => res.data))

  }
}


