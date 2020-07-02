import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service'
import { Publication } from '../../models/publication.model'

/* jQUERY */
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {

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
  @Input() user;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
    this.title = 'Publications';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit(): void {
    console.log('publications.component cargado correctamente')
    this.getPublications(this.user, this.page)
  }

  getPublications(user, page, adding = false){
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
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

            $("html, body").animate({ scrollTop: $('html').prop("scrollHeight")}, 500);
          }
          
          if(page > this.pages){
            //this._router.navigate(['/home']);
          }
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

      this.getPublications(this.user, this.page, true);
  }

}
