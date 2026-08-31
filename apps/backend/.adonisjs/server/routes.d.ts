import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'conferences.conferences.index': { paramsTuple?: []; params?: {} }
    'conferences.conferences.store': { paramsTuple?: []; params?: {} }
    'conferences.conferences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'conferences.conferences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'conferences.conferences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'conferences.conferences.index': { paramsTuple?: []; params?: {} }
    'conferences.conferences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'conferences.conferences.index': { paramsTuple?: []; params?: {} }
    'conferences.conferences.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'conferences.conferences.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'conferences.conferences.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'conferences.conferences.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}