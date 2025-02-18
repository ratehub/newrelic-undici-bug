import newrelic from 'newrelic';

async function doWork() {
    console.log("Starting undici fetch bug reproduction");

    try {
        const result = await fetch('http://somethingthatdoesntexist.newrelic.com');
        console.info(result);
    } catch (e) {
        console.error(e);
        newrelic.noticeError(new Error('Lee custom error to prove apm is working with agent v12.13.0'));
    }
    console.log("Finished undici fetch bug reproduction");
}

await newrelic.startBackgroundTransaction('job-do-work', () => doWork());

await new Promise((resolve) => {
    newrelic.shutdown({
        collectPendingData: true,
    }, (error) => {
        if (error) {
            console.error('Error during New Relic shutdown', { error });
        }

        console.info('New Relic shutdown complete.');

        resolve(true);
    });
});