import { logger } from './logger'

export class Notify {
  private readonly logger = logger
  private readonly pushkey = process.env.PUSHDEER_KEY ?? ''

  public markdown(info: { title?: string, md?: string }) {
    if (!this.pushkey) {
      this.logger.error('Push key is not set')
      return
    }

    const { title = '', md = '' } = info

    fetch(`https://api2.pushdeer.com/message/push?pushkey=${this.pushkey}&text=${title}&desp=${encodeURIComponent(md)}&type=markdown`)
      .catch(err => this.logger.error('Failed to send success notification:', err))
  }
}
