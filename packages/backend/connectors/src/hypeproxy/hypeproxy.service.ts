import { Logger } from '@nestjs/common';
import { Agents } from '@scrapoxy/backend-sdk';
import {
    CONNECTOR_HYPEPROXY_TYPE,
    EProxyStatus,
    EProxyType,
} from '@scrapoxy/common';
import { HypeproxyApi } from './api';
import type {
    IConnectorHypeproxyCredential,
    IHypeproxyProxy,
} from './hypeproxy.interface';
import type { IConnectorService } from '@scrapoxy/backend-sdk';
import type {
    IConnectorProxyRefreshed,
    IProxyKeyToRemove,
    IProxyTransport,
} from '@scrapoxy/common';


function convertToProxy(proxy: IHypeproxyProxy): IConnectorProxyRefreshed | undefined {
    const config: IProxyTransport = {
        type: EProxyType.HTTP,
        address: {
            hostname: proxy.hub,
            port: proxy.httpPort,
        },
        auth: {
            username: proxy.user,
            password: proxy.password,
        },
    };
    const p: IConnectorProxyRefreshed = {
        type: CONNECTOR_HYPEPROXY_TYPE,
        key: proxy.id,
        name: proxy.shortId,
        status: EProxyStatus.STARTED,
        config,
    };

    return p;
}


export class ConnectorHypeproxyService implements IConnectorService {
    private readonly logger = new Logger(ConnectorHypeproxyService.name);

    private readonly api: HypeproxyApi;

    constructor(
        credentialConfig: IConnectorHypeproxyCredential,
        agents: Agents
    ) {
        this.api = new HypeproxyApi(
            credentialConfig.token,
            agents
        );
    }

    async getProxies(keys: string[]): Promise<IConnectorProxyRefreshed[]> {
        this.logger.debug(`getProxies(): keys.length=${keys.length}`);

        const proxies = await this.api.getInformations();
        const proxiesFiltered = proxies
            .map(convertToProxy)
            .filter((p) => p && keys.includes(p.key));

        return proxiesFiltered as IConnectorProxyRefreshed[];

    }

    async createProxies(
        count: number, excludeKeys: string[]
    ): Promise<IConnectorProxyRefreshed[]> {
        this.logger.debug(`createProxies(): count=${count} / excludeKeys.length=${excludeKeys.length}`);

        const proxies = await this.api.getInformations();
        const proxiesFiltered = proxies
            .map(convertToProxy)
            .filter((p) => p && !excludeKeys.includes(p.key))
            .slice(
                0,
                count
            );

        return proxiesFiltered as IConnectorProxyRefreshed[];
    }

    async startProxies(keys: string[]): Promise<void> {
        this.logger.debug(`startProxies(): keys.length=${keys.length}`);

        // Not used
    }

    async removeProxies(keys: IProxyKeyToRemove[]): Promise<string[]> {
        this.logger.debug(`removeProxies(): keys.length=${keys}`);

        const promises = keys
            .filter((p) => p.force)
            .map((p) => this.api.directRenewIp(p.key));

        await Promise.all(promises);

        return keys.map((p) => p.key);
    }
}
