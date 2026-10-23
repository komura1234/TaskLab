import { inject, Pipe, PipeTransform } from '@angular/core';
import { RemoteService,Flag } from '../../core/config/remote-config/remote-service';

@Pipe({
  name: 'flag',
  pure:false
})
export class FlagPipe implements PipeTransform {
  private readonly remote=inject(RemoteService)
  transform(flag:Flag): unknown {
    return this.remote.activo(flag);
  }
}
