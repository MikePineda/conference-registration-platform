import { InjectionToken } from '@angular/core'
import { createTuyau } from '@tuyau/core/client'
import { registry } from '@api-starter-kit/backend/registry'
import { environment } from '../../environments/environment'

export const TOKEN_KEY = 'auth_token'

export const API = new InjectionToken('TuyauClient', {
  providedIn: 'root',
  factory: () =>
    createTuyau({
      baseUrl: environment.apiUrl,
      registry,
      headers: { Accept: 'application/json' },
      hooks: {
        beforeRequest: [
          (request) => {
            const token = localStorage.getItem(TOKEN_KEY)
            if (token) {
              request.headers.set('Authorization', `Bearer ${token}`)
            }
          },
        ],
      },
    }),
})