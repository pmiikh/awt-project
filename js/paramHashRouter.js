
export default class ParamHashRouter {
  constructor(routes,inithash) {
    this.routes = routes;

    window.addEventListener("hashchange", event => this.doRouting(event));

    window.location.hash=inithash;
    this.doRouting(inithash);
  }


  doRouting() {
    let hash = window.location.hash;
    if (hash) {
      hash = hash[0] === '#' ? hash.substr(1) : hash;
      let hashParts =  hash.split("/");
      const matchingRoute = this.routes.find(route => route.hash === hashParts[0]);

      if (matchingRoute) {
        hashParts.shift();
        matchingRoute.getTemplate(matchingRoute.target,...hashParts);
      }

      /*
        here we do nothing if the matching route is not found.
        This allows other fragments that we do not want to be  processed by the router to work as usual.
        Otherwise ()
       */
    }
  }


}