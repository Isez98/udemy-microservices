import { Publisher, Subjects, ExpirationComplete } from '@dbtsr/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationComplete> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
