import sdk from 'media-platform-js-sdk';
import request from 'request';
import submitToSpreadsheet from './spreadsheet';

/*
Example of media statics server response:

ImageDTO {
  parentFolderId: 'b01921b4c74adab3a8e964da139e3ec6',
  hash: '365d26b298446fbe4aa3961c143dfabf',
  originalFileName: 'mshrm.jpg',
  fileName: 'f70622_1b5d4c2894f0493aab7cbd32fd1efd42~mv2_d_1920_2560_s_2.jpg',
  fileUrl: 'media/f70622_1b5d4c2894f0493aab7cbd32fd1efd42~mv2_d_1920_2560_s_2.jpg',
  baseUrl: 'media/f70622_1b5d4c2894f0493aab7cbd32fd1efd42~mv2_d_1920_2560_s_2.jpg',
  fileSize: 493415,
  iconUrl: 'media/f70622_1b5d4c2894f0493aab7cbd32fd1efd42~mv2_d_1920_2560_s_2.jpg',
  mediaType: 'picture',
  mimeType: 'image/jpeg',
  lables: [],
  tags: [],
  status: null,
  dateCreated: 1478532703,
  dateModified: 1478532703,
  height: 2560,
  width: 1920,
  faces: null }

Meta example:
{ email: 'iuriik@wix.com',
  fullName: 'Iurii Komarov',
  phoneNumber: '(000)123 4567',
  country: 'ISR',
  typeWixUser: false,
  typeCCMember: false,
  description: '123123123',
  uuid: null || String }
*/

export default class Uploader {
  // credentials are: {domain, appId, sharedSecret, userId}
  constructor(creds) {
    this._creds = creds;
    this._mp = new sdk.MediaPlatform(Object.assign(this._creds));
  }

  get _uploadRequest() {
    return new sdk.file.UploadRequest()
        .setFileName(this._file.originalname)
        .setContentType(this._file.mimetype);
  }

  get _proGalleryUrl() {
    return `http://progallery.wix.com/_api/pro-gallery-editor-webapp/v1/gallery/a4907783-98c6-4a6e-a482-609231526a7a/items?instance=RshfnhEMCL0COP2mPSo0D3TDAFpxiDrQ1mHcLnXTSDo.eyJpbnN0YW5jZUlkIjoiN2FhMjRlZWItOGNiZi00ZDNhLTgwMzEtMTFhZmMwMWYyZWQ2Iiwic2lnbkRhdGUiOiIyMDE2LTExLTIzVDE0OjA2OjIwLjQzMFoiLCJ1aWQiOiI3Zjc4ZjNjYy1hZDhiLTRjNTAtOWFkMi0zZGI3MDFlM2ZlNTQiLCJwZXJtaXNzaW9ucyI6Ik9XTkVSIiwiaXBBbmRQb3J0IjoiODkuMjIuNDcuMTc5LzYyMjQwIiwidmVuZG9yUHJvZHVjdElkIjpudWxsLCJkZW1vTW9kZSI6ZmFsc2UsImJpVG9rZW4iOiJkMzkxZDRkZS00MmM3LTBjNzQtMWFkMy1iN2UzM2UzYjJjZTUiLCJzaXRlT3duZXJJZCI6IjdmNzhmM2NjLWFkOGItNGM1MC05YWQyLTNkYjcwMWUzZmU1NCJ9`;
  }

  get _proGalleryCookie() {
    return `userType=REGISTERED; wixClient=share-your-talent||NOT_VERIFIED_OPT_IN|0|1479909945934|1481205945934|7f78f3cc-ad8b-4c50-9ad2-3db701e3fe54|{}; wixLanguage=en; wixSession2=JWT.eyJraWQiOiJrdU42YlJQRCIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1widXNlckd1aWRcIjpcIjdmNzhmM2NjLWFkOGItNGM1MC05YWQyLTNkYjcwMWUzZmU1NFwiLFwidXNlck5hbWVcIjpcInNoYXJlLXlvdXItdGFsZW50XCIsXCJjb2xvcnNcIjp7fSxcInVjZFwiOlwiMjAxNi0xMS0xNlQxNDo0NzoxNC4wMDArMDAwMFwiLFwid3hzXCI6ZmFsc2UsXCJld3hkXCI6dHJ1ZSxcInJtYlwiOnRydWUsXCJsdmxkXCI6XCIyMDE2LTExLTIzVDE0OjA1OjQ1LjkyMyswMDAwXCIsXCJsYXRoXCI6XCIyMDE2LTExLTIzVDE0OjA1OjQ1LjkyMyswMDAwXCIsXCJ3eGV4cFwiOlwiMjAxNi0xMi0wOFQxNDowNTo0NS45MjMrMDAwMFwifSIsImlhdCI6MTQ3OTkwOTk0NSwiZXhwIjoxNDgxMjA1OTQ1fQ.GE6On3hFaAHkf14WxwOMA7Avhxmy7ggpAiKaEzH16GdpdkkUSqkk9304e_t39RGX28YMpnmIPhuczxNcmRFbuiGlVwOJPcLNOoVieDdc0hyw5ZIFsJdQ9JWWo1QaF8crzCLludZ2OZbM5HtIPKg-ELKp_wViKOA9DSrBHbJbf9ZlydCPHqVz09eHSBGZg5ssdVeMfc3UDof5uBL-EOLWJm9weka8fZRn3WtQJI_ibo2joy5QfmmK8kSNuCAxoSs0dmXAiUU_RYxsUWEgwWQxaR3-PQLiNg3l7ethLfCovLOmnduZ0HleFdAgXuDYQdyTlif3kGphDgaTp2tN28A4Sg; _wixUIDX=1231524940|7f78f3cc-ad8b-4c50-9ad2-3db701e3fe54; _wixCIDX=d611e00f-9576-42da-89e5-10efc2669f72; _wixAB3|c94b43ed-9549-4a74-9e99-d528752ae700=17152#2|17260#2|17262#2|17492#2|17431#1|16016#2|2001#2|16302#1|17013#1|17072#1|17146#1; _wixAB3|f70622ef-5840-45dd-8af9-e647ef8fcc3d=2001#2|16302#1|17013#5|17072#2|17146#2|17260#2|17262#2|17492#1|16016#2|12792#2|13703#1|15850#2|17446#1|14484#2|14485#2|15368#5; _wixAB3|54fc605c-547d-4a78-94e3-715958fd935c=17533#2|12792#1|15850#2|2001#2|17013#6|17072#1|17146#1|17492#2|16016#1|17644#1|17696#1|17648#2|17550#2|17715#1; _wixAB3=16270#1|14077#1|16695#2|7691#1|17538#2|17596#1|17647#1|17691#2; _wixAB3|7f78f3cc-ad8b-4c50-9ad2-3db701e3fe54=17533#2|2001#1|17013#5|17072#2|17146#2|17492#1|17644#1|16016#1|17547#1|12792#2|15850#2|17622#2|17696#1|17648#1|17715#1|17550#2; XSRF-TOKEN=1479911297|fzpqgP7DaxM4; incap_ses_408_133961=ABclV4WdaH3g//23SIKpBXenNVgAAAAAwgT5F/5OkHiNsT/3Ifqnlg==; _wix_browser_sess=24045c6d-a46b-4aa7-9a84-e9db73849c3d; incap_ses_408_133987=rdhEDk3s+hTqDAS4SIKpBUCqNVgAAAAAKZSX1/zMZD3mO3W+wnZT2w==; __utma=248670552.1670081359.1478085981.1479909976.1479912011.3; __utmb=248670552.1.10.1479912011; __utmc=248670552; __utmz=248670552.1479912011.3.3.utmcsr=wix.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _ga=GA1.2.1670081359.1478085981; visid_incap_133987=P3J8gul6R7m3n0F2wLZkkW9lNVgAAAAAQ0IPAAAAAAAzdIXzhob87zU4icQLoa7F`;
  }

  do(file, meta, callback) {
    this._callback = callback;
    this._file = file;
    this._meta = meta;
    this._doMediaStatics();
  }

  _doMediaStatics() {
    this._mp.fileUploader.uploadImage(
      this._creds.userId, this._file.buffer, this._uploadRequest,
      (error, response) => {
        if (error) {
          this._terminate(1, error);
        } else {
          this._meta.file = Object.assign({}, response);
          this._doProGallery();
        }
      }
    );
  }

  _doProGallery() {
    const r = this._meta.file;
    const data = {
      items: [{
        itemId: r.fileName.replace(/\.[^/.]+$/, ''),
        mediaUrl: r.fileName,
        orderIndex: Math.round(Math.random() * 1000) + (Date.now() * 1000),
        metaData: {
          height: r.height,
          width: r.width,
          lastModified: r.dateModified,
          name: r.originalFilename,
          description: this._meta.description || '',
          title: this._meta.title || ''
        }
      }]
    };
    console.log('submit image to ProGallery', JSON.stringify(data));
    request({
      url: this._proGalleryUrl,
      method: 'POST',
      headers: {
        Cookie: this._proGalleryCookie,
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(data)
    }, (error, response) => {
      if (response.statusCode >= 400) {
        this._done(1);
      } else {
        this._doSpreadsheet(data.items[0].mediaUrl);
      }
    });
  }

  _doSpreadsheet(mediaUrl) {
    this._meta.mediaUrl = mediaUrl;
    console.log('submit data do spreadsheet', this._meta);
    submitToSpreadsheet(this._meta).then(
      () => this._done(3), () => this._done(2)
    );
  }

  _terminate(error) {
    console.error('image is not sumbitted', error);
    this._callback(false);
  }

  _done(step) {
    console.log(`image submitting ended on step ${step}:`, this._meta);
    this._callback(true, step, this._meta);
  }
}
