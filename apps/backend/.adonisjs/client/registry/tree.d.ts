/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  conferences: {
    conferences: {
      index: typeof routes['conferences.conferences.index']
      store: typeof routes['conferences.conferences.store']
      show: typeof routes['conferences.conferences.show']
      update: typeof routes['conferences.conferences.update']
    }
  }
}
