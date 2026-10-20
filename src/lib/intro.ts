export const INTRO_KEY = 'chavatrix.intro';

/**
 * Script previo al pintado: si la intro ya se vio en esta sesión o el usuario prefiere
 * movimiento reducido, se marca <html data-intro="skip"> y la intro no se muestra.
 */
export const introInitScript = `(function(){try{var s=null;try{s=sessionStorage.getItem('${INTRO_KEY}')}catch(e){}var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(s||r){document.documentElement.setAttribute('data-intro','skip')}}catch(e){}})();`;
