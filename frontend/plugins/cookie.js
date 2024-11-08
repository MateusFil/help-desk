import Cookies from 'js-cookie'

export default ({ app }, inject) => {
  // Injetar o Cookies para ser usado no seu app
  inject('cookies', Cookies)
}
