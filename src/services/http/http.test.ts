import Http from ".";
import { IHttp } from "./IHttp";



//@ts-ignore
global.fetch = jest.fn().mockImplementation((arg: string) => {
    if (arg === 'endpointfail') {
        return Promise.reject(new Error('fail'));
    }
    return Promise.resolve({
        ok: true,
        Id: '123',
        json: function () {
            return { Id: '123' }
        }
    })
});

describe('HttpService', () => {
    let instance: IHttp;

    beforeEach(() => {
        instance = new Http('endpoint');
    });

    it("should get a response back", async function () {
        const payload = instance.get('ms');
        console.log(payload)
    });

    it("should get a response back", async function () {
        const payload = instance.get('fail');
        console.log(payload)
    });

});