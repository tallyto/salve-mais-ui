import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Chart, registerables } from 'chart.js';

import { AppModule } from './app/app.module';

Chart.register(...registerables);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(() => {});
