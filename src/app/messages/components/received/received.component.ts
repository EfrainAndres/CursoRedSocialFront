import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message.model'
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Follow } from '../../../models/follow.model';
import { FollowService } from '../../../services/follow.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'received',
  templateUrl: './received.component.html',
  providers: [FollowService, MessageService]
})
export class ReceivedComponent implements OnInit {

  title: string;
  identity;
  token;
  url: string;
  status: string;
  follows;
  messages: Message[];
  page;
  pages;
  total;
  next_page;
  prev_page;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService: UserService
  ) {
    this.title = 'Mensajes recibidos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    console.log('received.component cargado...');
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;

      if (!params['page']) {
        page = 1;
      }

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }

      this.getmessages(this.token, this.page)
    });
  }

  getmessages(token, page) {
    this._messageService.getMyMessages(token, page).subscribe(
      response => {
        if (!response.messages) {
          
        }else{
          this.messages = response.messages;
          this.total = response.total;
          this.pages = response.pages;
        }
      }, error => {
        console.log(<any>error)
      }
    )
  }

}
