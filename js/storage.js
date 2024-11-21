// const STORAGE_TOKEN = 'PU8XMPB7URSE6FTX5S08BD2P3NPKTZF3KB87EMNH';
// const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const STORAGE_URL = 'https://join-4cacd-default-rtdb.europe-west1.firebasedatabase.app/';


async function setItem(key, value) {
    const url = `${STORAGE_URL}${key}.json`;
    payload = JSON.stringify(value);
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    // .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}${key}.json`;
    let response = await fetch(url);        
    return response.json();
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