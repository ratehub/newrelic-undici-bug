// Don't forget to configure newrelic.js or add ENV vars/.env file
import newrelic from 'newrelic';

async function doWork() {
    console.log("Starting undici fetch bug reproduction");

    try {
        const result = await fetch('http://somethingthatdoesntexist.newrelic.com');
        console.info(result);
    } catch (e) {
        // Here we log out the error. You'll notice we never call noticeError with the actual error object.
        // No matter what we do in this catch block, the error will still get reported by the newrelic agent.
        // This doesn't happen for non-undici errors.
        console.error(e);
        newrelic.noticeError(new Error('Lee custom error to prove apm is working with agent v12.13.0'));
    }
    console.log("Finished undici fetch bug reproduction");
}

// Wrap in a transaction. Not sure if this was needed, the newrelic UI was infinitely reloading until I did this.
await newrelic.startBackgroundTransaction('job-do-work', () => doWork());

// Not sure if this is explicitly necessary for the reproduction.
// We usually end our jobs with process.exit which I believe is why
// this is needed in our production codebase.
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