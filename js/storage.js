const STORAGE_TOKEN = 'PU8XMPB7URSE6FTX5S08BD2P3NPKTZF3KB87EMNH';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    // return fetch(url).then(res => res.json());
    return await fetch(url)
        .then(res => res.json().then(res => res.data.value));
}

async function resetRemote(key) {
    await setItem(key, []).then();
}

async function getRemote(key) {
    let values = [];
    let storedPromise = await getItem(key);
    storedValue = JSON.parse(storedPromise);

    if (!isJSON(storedValue)) {
        console.log('#### storedValue is not JSON');
        console.log('All stored tasks are gone.');
        resetTasks(key)
    } else {
        values = storedValue;
    }

    return values;
}

function printAllTasks(tasks) {
    tasks.forEach(task => {
        printTask(task);
    });
}

function printTask(task) {
    Object.keys(task).forEach(function (key) {
        console.log(key + ": " + task[key]);
    });
}


function isJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}