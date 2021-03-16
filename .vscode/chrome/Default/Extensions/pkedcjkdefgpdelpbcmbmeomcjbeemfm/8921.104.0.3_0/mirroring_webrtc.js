'use strict';var xCa={TAB:0,Wm:1,zt:2},Y$=function(a){Kb("MediaRouter.WebRtc.Start.Success",a,xCa)};var Z$=function(a,b){Tj.call(this,b);this.L=a;this.l=new ob;this.g=gw(b.id);this.m=new ob;this.F=!1;this.C=null;this.D=!1;this.s=this.u=null;yCa(this);zCa(this);this.g.sendMessage(new fs("GET_TURN_CREDENTIALS"))};t(Z$,Tj);
Z$.prototype.start=function(a){var b=this;return this.l.promise.then(function(c){if(c.g)return Promise.reject(new Zi("Mirroring already started"));if(b.C)return Promise.reject(new Zi("Session permanently stopped"));b.u=new zb("MediaRouter.WebRtc.Session.Launch");c.ia.addStream(a);c.start();return b.m.promise})};
Z$.prototype.stop=function(){var a=this;this.m.reject(new Zi("Session stop requested."));this.s&&(this.s.end(),this.s=null);if(this.C)return this.C;this.D=this.F=!1;this.u=null;return this.C=this.l.promise.then(function(b){b.stop()}).then(function(){return a.g.dispose()}).catch(function(b){a.g.dispose();throw b;})};
var yCa=function(a){a.g.onMessage=function(b){if(!b.type)throw Error("Message has no type.");switch(b.type){case "TURN_CREDENTIALS":a.l.resolve(new sv(a.h.id,b.data.credentials));break;case "ANSWER":a.l.promise.then(function(c){Av(c,b.data)});break;case "KNOCK_ANSWER":a.D=!0;a.l.promise.then(function(c){Av(c,b.data)});break;case "STOP":a.m.reject(new Zi("Stop signal received"));a.stop();break;default:throw new Zi("Unknown message type: "+b.type);}}},zCa=function(a){a.l.promise.then(function(b){wv(b,
function(c){a.g.sendMessage(new fs("OFFER",new hs(c,a.L)))});xv(b,function(c){c=JSON.parse(c);if(!c.type)throw Error("Invalid message");a.g.sendMessage(new fs(c.type,c.data))});tv(b,function(){a.F=!0;a.g.sendMessage(new fs("SESSION_START_SUCCESS"));!a.D&&a.u&&a.u.end();a.u=null;a.s=new Gb("MediaRouter.WebRtc.Session.Length");a.m.resolve(a)});vv(b,function(){a.g.sendMessage(new fs("SESSION_END"))});uv(b,function(c){a.F||a.m.reject(c);a.g.sendMessage(new fs("SESSION_FAILURE"))})})};var $$=function(){Hj.call(this,"webrtc")};t($$,Hj);k=$$.prototype;k.yi=function(a,b){return new Z$(a,b)};k.Vh=function(){Y$(0)};k.Sh=function(){Y$(1)};k.nj=function(){Y$(2)};k.Th=function(){Jb("MediaRouter.WebRtc.Session.End")};k.Kg=function(a){Kb("MediaRouter.WebRtc.Start.Failure",a,Yi)};k.Uh=function(){Jb("MediaRouter.WebRtc.Stream.End")};var ACa=new $$;yj("mr.mirror.webrtc.WebRtcService",ACa);
