import {
    Injectable,
    Type,
} from '@angular/core';
import { CONNECTOR_XPROXY_TYPE } from '@scrapoxy/connector-xproxy-sdk';
import {
    ConnectorprovidersService,
    EConnectorFactoryGroup,
} from '@scrapoxy/frontend-sdk';
import { ConnectorXProxyComponent } from './connector/connector.component';
import { CredentialXProxyComponent } from './credential/credential.component';
import type {
    IConnectorComponent,
    IConnectorConfig,
    IConnectorFactory,
    ICredentialComponent,
    IInstallComponent,
} from '@scrapoxy/frontend-sdk';


@Injectable()
export class ConnectorXProxyFactory implements IConnectorFactory {
    readonly type = CONNECTOR_XPROXY_TYPE;

    readonly config: IConnectorConfig = {
        name: 'XProxy',
        description: 'XProxy creates a secure proxy that supports HTTP, SOCKS5, IPv4, IPv6 with 4G/5G dongles',
        url: 'https://xproxy.io',
        group: EConnectorFactoryGroup.Hardware,
        canInstall: false,
        canUninstall: false,
        canReplaceProxy: true,
        useCertificate: false,
    };

    constructor(connectorproviders: ConnectorprovidersService) {
        connectorproviders.register(this);
    }

    init() {
        // Nothing
    }

    getCredentialComponent(): Type<ICredentialComponent> {
        return CredentialXProxyComponent;
    }

    getConnectorComponent(): Type<IConnectorComponent> {
        return ConnectorXProxyComponent;
    }

    getInstallComponent(): Type<IInstallComponent> {
        throw new Error('Not implemented');
    }
}