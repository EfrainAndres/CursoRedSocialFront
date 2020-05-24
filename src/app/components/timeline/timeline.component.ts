import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service'
import { Publication } from '../../models/publication.model'

/* jQUERY */
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {

  identity;
  token;
  title:string;
  url:string;
  status: string;
  page;
  total;
  pages;
  itemsPerPage;
  publications: Publication[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    console.log('timeline.component cargado correctamente')
    this.getPublications(this.page)
  }

  getPublications(page, adding = false){
    this._publicationService.getPublications(this.token,page).subscribe(
      response => {
        if(response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage  = response.items_per_page;

          if(!adding){
            this.publications = response.publications;
          }else{
            var arrayA =  this.publications;
            var arrayB = response.publications;

            this.publications = arrayA.concat(arrayB);

            $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500);
          }
          
          /*if(page > this.pages){
            this._router.navigate(['/home']);
          }*/
        }else{
          this.status = 'error'
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error';
        }
      }
    )
  }

  public noMore = false;

  viewMore(){
      this.page += 1;
      if(this.page == this.pages){
          this.noMore = true;
      }

      this.getPublications(this.page, true);
  }

  refresh(event){
    this.getPublications(1);
  }

}
