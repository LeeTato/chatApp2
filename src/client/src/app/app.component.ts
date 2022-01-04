import { Component } from '@angular/core';
import { isObservable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './services/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
//export class AppComponent {
  // addUser: FormGroup;
//   title = 'client';
//   chat='';
//   list:[]=[]
//   message = '*message*';


//   constructor(private fb: FormBuilder, private socketService: SocketService, private socket: Socket) {
//     // this.addUser = this.fb.group({
//     //   chat:['', Validators.required]
//     // })

//     socket.on('ServerToClient', (data:string)=>{this.message=data})
//   }


// ngOnInit() {
//   // this.socketService.getMessage().subscribe(message => { console.log(message); });
//   this.socket.on('message',(message: any)=>{
//      console.log(message);
//     })

//   }

//   // sendMessage(chat : string){
//   //   this.socket.emit(this.chat).subscribe(()=>this.list.push(chat))}
//  add(chat:string){
//    this.socket.emit('add', chat)
//  }

//   }

export class AppComponent {
  title = 'Chat-App';
  user: String | undefined;
  room: String | undefined;
  // tslint:disable-next-line:ban-types
  messageText: String | undefined;
  messageArray: Array<{user: String , message: String }> = [];
  constructor(private chatService:ChatService){
    this.chatService.newUserJoined()
      .subscribe(data => this.messageArray.push(data));


    this.chatService.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this.chatService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  }

  join(){
      this.chatService.joinRoom({user: this.user, room: this.room});
  }

  leave(){
    this.chatService.leaveRoom({user: this.user, room: this.room});
  }

  sendMessage()
  {
    this.chatService.sendMessage({user: this.user, room: this.room, message: this.messageText});
  }
}
