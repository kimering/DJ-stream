const app = new Vue({
  el: '.mdl-layout',

  data: {
    // UI 문자열
    text: {
      title: 'DJ-stream',
      intro: '환영합니다!',
      loginButton: '페이스북 계정으로 로그인',
      guestButton: '다음에 할게요',

      logoutButton: '로그아웃',
      mypageButton: '내 정보',

      nickname: '닉네임',
      regexError: '잘못된 형식입니다',
      confirmButton: '적용',
    },

    // 화면정보
    page: '/intro',

    // 내 정보
    me: {},

    // 유저정보
    user: {},

    // 작품정보들
    waves: [],

    // 검색키워드
    searchKeyword: '',
  },

  methods: {
    /**
     * 클라이언트측에서 url을 바꿀 때 이 함수를 사용한다.
     * 두번째 파라미터를 따라 history에 push하거나 replace한다.
     * @param {String} path 주소
     * @param {Boolean} replace push or replace
     * @return {SideEffect}
     */
    go( path, replace ){
      const page = path.replace( /\?.*/, '' )

      if( !replace ){
        history.pushState( page, '검색창', path )
      }
      else{
        history.replaceState( page, '검색창', path )
      }

      // 햄버거메뉴 숨기기
      $( '.mdl-layout__drawer' ).removeClass( 'is-visible' );
      $( '.mdl-layout__obfuscator' ).removeClass( 'is-visible' );

      // 라우터
      switch( page ){
        case '/intro':
          $( '.slide' ).hide()
          $( '#intro' ).show()
          this.page = page
        break;

        case '/':
          $( '.slide' ).slideUp()
          this.searchKeyword = ''
          this.page = page
        break;

        case '/join':
          $( '#join' ).slideDown()
          this.page = page
        break;

        // 임시
        case '/wave':
          drawMixer()
          this.page = page
        break;

        default:
          const params = path.split('/')

          // 유저
          if( !params[2] ){
            app.getUserInfo( params[1] )
            this.page = '/:user'
          }
          // 작품
          else{

          }
        break;
      }

      setTimeout( () => componentHandler.upgradeDom(), 100 )
    },

    /**
     * 작품들을 검색한다.
     * @param {String}  keyword 키워드
     * @return {SideEffect}
     */
    search( keyword ){
      const path = `/search?k=${ keyword }`
      const replace = this.page == '/search'

      $.ajax({
        url : '/search',
        data : {
          k : keyword
        }
      })
      .done( data => {
        this.waves = data
        this.go( path, replace )
      })
    },

    /**
     * 유저 정보를 요청한다.
     * @param {String}  id  아이디
     * @return {SideEffect}
     */
    getUserInfo( id ){
      $.ajax( `/${ id }` )
      .done( data => {
        this.user = data
      })
    },
  },

})

// 히스토리 감시
window.onpopstate = ( event ) => {
  const page = document.location.pathname
  app.go( page, true )
}

// main
app.go( document.location.pathname, true )
