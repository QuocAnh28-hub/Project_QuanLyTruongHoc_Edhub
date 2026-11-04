import dayjs from "dayjs";

const STORE_TYPES = {
    session: 'session',
    local: 'local'
}
export const StorageHelper = {
    types: {
        session: STORE_TYPES.session,
        local: STORE_TYPES.local
    },
    get(cacheTitle: string, storeType: string = STORE_TYPES.session) {
        if (typeof (Storage) !== "undefined") {
            let result = null;
            if (storeType === STORE_TYPES.local) {
                result = localStorage.getItem(cacheTitle);
            }
            if (storeType === STORE_TYPES.session) {
                result = sessionStorage.getItem(cacheTitle);
            }
            if (result) {
                const data = JSON.parse(result);
                if (storeType === STORE_TYPES.local) {
                    if (data.value == null || data.expire_at == null) {
                        localStorage.removeItem(cacheTitle);
                    }
                    else {
                        const now = dayjs();
                        if (data.expire_at > 0 && now > data.expire_at) {
                            localStorage.removeItem(cacheTitle);
                        }
                        else {
                            return data.value
                        }
                    }
                }
                else {
                    return JSON.parse(result);
                }
            }
        }
        return null
    },
    set: (
        cacheTitle: string,
        object: any,
        storeType: string = STORE_TYPES.session,
        expire_in: number = 0 // in minutes. 0 means never expire
    ) => {
        if (typeof (Storage) !== "undefined") {
            if (!object) return false;
            if (storeType === STORE_TYPES.local) {
                const now = dayjs();
                const time_expire = expire_in === 0 ? 0 : now.add(expire_in, 'minute').unix()
                const objCache = { value: object, expire_at: time_expire }
                localStorage.setItem(cacheTitle, JSON.stringify(objCache));
            }
            if (storeType === STORE_TYPES.session) {
                sessionStorage.setItem(cacheTitle, JSON.stringify(object));
            }

            return true;
        }
        return false;
    },
    clear: (cacheTitle: string, storeType: string) => {
        if (typeof (Storage) !== "undefined") {
            if (storeType === STORE_TYPES.local) {
                localStorage.removeItem(cacheTitle);
            }
            if (storeType === STORE_TYPES.session) {
                sessionStorage.removeItem(cacheTitle);
            }
            return true;
        }
        return false;
    },
    clearAll: (storeType: string) => {
        if (typeof (Storage) !== "undefined") {
            if (storeType === STORE_TYPES.local) {
                localStorage.clear();
            }
            if (storeType === STORE_TYPES.session) {
                sessionStorage.clear();
            }
            return true;
        }
        return false;
    }
}
export const STORE_KEY_TOKEN = 'dacc-a977eb5bc92a'