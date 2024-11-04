import { useEffect, useState } from 'react';
import { sleep } from '../utilities/index';
import { Translate } from './useLocalization';

export interface SplashScreenTasks {
  mandatoryAsync?: (() => Promise<SplashScreenHandler>)[];
  mandatorySync?: ((
    context: SplashScreenContext,
  ) => () => Promise<SplashScreenHandler>)[];
  optionalAsync?: (() => Promise<SplashScreenHandler>)[];
}

export interface SplashScreenContext {
  dispatch: any;
  t: Translate;
  navigation: any;
}

interface useSplashScreenConfig {
  minWaitTime?: number;
  context: SplashScreenContext;
}

export interface SplashScreenHandler {
  result: boolean;
  handler?: () => void;
}

export default function useSplashScreen(
  {
    mandatoryAsync = [],
    mandatorySync = [],
    optionalAsync = [],
  }: SplashScreenTasks,
  start = true,
  config: useSplashScreenConfig,
): { status: boolean } {
  const { minWaitTime = 10 } = config || {};
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    let retryTO: NodeJS.Timeout;

    async function triggerMinWaitTime() {
      await sleep(minWaitTime);
      return true;
    }

    async function startMandatoryTasks() {
      const mandatoryAsyncTasks = Promise.all([
        ...mandatoryAsync.map(t => t()),
        triggerMinWaitTime(),
      ]);
      const mandatoryTasks = mandatorySync.reduce(
        (p, fn) =>
          p.then(fn(config.context)).then(r => {
            r.handler && r.handler();
            if (!r.result) return Promise.reject();
            return r.result;
          }),
        Promise.resolve(true),
      );

      const allMandatory = await Promise.all([
        mandatoryAsyncTasks,
        mandatoryTasks,
      ]).catch(e => console.log('retry'));

      console.log('all Mandatory', allMandatory);
      if (!allMandatory) {
        // retryTO = setTimeout(() => {
        //   startProgress();
        // }, 5000);
      } else setStatus(true);
    }

    async function startProgress() {
      // optional tasks are for preloading
      optionalAsync.map(t => t());
      startMandatoryTasks();
    }

    if (start) startProgress();

    return () => {
      retryTO && clearTimeout(retryTO);
    };
  }, [start]);

  return {
    status,
  };
}
