import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import io from 'socket.io-client';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: String
  room: String 

  constructor(private api:ApiService) { }

  socket = io('http://localhost:3000/');// URL where  the server is running


  joinRoom(data: any){
    this.socket.emit('join', data)
  }

  newUserJoined(){
    let observable = new Observable<{user:String, message:string}>((observer:any)=>{
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
    let observable = new Observable<{user:String, message:String}>(observer=>{
      this.socket.on('left room', (data)=>{
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
    let observable = new Observable<{user:String, message:String}>(observer=>{
      this.socket.on('new message', (data)=>{
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });

    return observable;
  }
}


