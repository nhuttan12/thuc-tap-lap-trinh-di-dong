'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">back-end documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-57c8fd5f0e4ad8cee844512711873f2faeeb60aba7e292c68d155b692f8a2b9d1632c12637c53bdf829c5d478a29a1b792a9f8e569dc9852bbfe9c3f5178d7e5"' : 'data-bs-target="#xs-injectables-links-module-AppModule-57c8fd5f0e4ad8cee844512711873f2faeeb60aba7e292c68d155b692f8a2b9d1632c12637c53bdf829c5d478a29a1b792a9f8e569dc9852bbfe9c3f5178d7e5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-57c8fd5f0e4ad8cee844512711873f2faeeb60aba7e292c68d155b692f8a2b9d1632c12637c53bdf829c5d478a29a1b792a9f8e569dc9852bbfe9c3f5178d7e5"' :
                                        'id="xs-injectables-links-module-AppModule-57c8fd5f0e4ad8cee844512711873f2faeeb60aba7e292c68d155b692f8a2b9d1632c12637c53bdf829c5d478a29a1b792a9f8e569dc9852bbfe9c3f5178d7e5"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppThrottlerModule.html" data-type="entity-link" >AppThrottlerModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' :
                                            'id="xs-controllers-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' :
                                        'id="xs-injectables-links-module-AuthModule-74c982ad9f652cf12db71e086a9109c722aaab1de0143bb9defc761b8d0431996da78901ebc5d12ccdbdbf5d0e6d649ac5b64e048d3f0af952ee5b2373073d2e"' }>
                                        <li class="link">
                                            <a href="injectables/AuthMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GoogleStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoogleStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserAuthenticationRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserAuthenticationRepository</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BrandModule.html" data-type="entity-link" >BrandModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' : 'data-bs-target="#xs-controllers-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' :
                                            'id="xs-controllers-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' }>
                                            <li class="link">
                                                <a href="controllers/BrandController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' : 'data-bs-target="#xs-injectables-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' :
                                        'id="xs-injectables-links-module-BrandModule-815b4b4c6c32bb264cf81c4a1c37c543f13573e98cc4028a8d8827e22a6abed6976c0ced448be5c21eae52aebb748f85a356a80662d45528c12f0620b0971776"' }>
                                        <li class="link">
                                            <a href="injectables/BrandMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BrandService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CartModule.html" data-type="entity-link" >CartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' : 'data-bs-target="#xs-controllers-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' :
                                            'id="xs-controllers-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' }>
                                            <li class="link">
                                                <a href="controllers/CartController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CheckoutController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CheckoutController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' : 'data-bs-target="#xs-injectables-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' :
                                        'id="xs-injectables-links-module-CartModule-a9d989491b187d97d8f5dec06175831bfa4cc43fe605a9391cadda61fc92fe755ff38654e991f141f2060db00e2502aeb4b648da3a643e930ee95b84a40eb44e"' }>
                                        <li class="link">
                                            <a href="injectables/CartDetailMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartDetailMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CartDetailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartDetailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CartMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CartService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CheckoutService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CheckoutService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoryModule.html" data-type="entity-link" >CategoryModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CategoryModule-a885384c891bca5063763359a3311f95dd7eea165f7e1c1b428d97c9fec518550ab700f988dfda93182cffe99bfe373cca2a6ff88791b37ae0f9427be30ad727"' : 'data-bs-target="#xs-injectables-links-module-CategoryModule-a885384c891bca5063763359a3311f95dd7eea165f7e1c1b428d97c9fec518550ab700f988dfda93182cffe99bfe373cca2a6ff88791b37ae0f9427be30ad727"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoryModule-a885384c891bca5063763359a3311f95dd7eea165f7e1c1b428d97c9fec518550ab700f988dfda93182cffe99bfe373cca2a6ff88791b37ae0f9427be30ad727"' :
                                        'id="xs-injectables-links-module-CategoryModule-a885384c891bca5063763359a3311f95dd7eea165f7e1c1b428d97c9fec518550ab700f988dfda93182cffe99bfe373cca2a6ff88791b37ae0f9427be30ad727"' }>
                                        <li class="link">
                                            <a href="injectables/CategoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link" >ConfigModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ConfigModule-8157672d4742424b8abfdf3fc3879a399fd982eb54f6ea8425f548b4dc37f638dbd85b8c85b0128e8b6de001dc92ef3a6dd63ac133bddf862b13eea44f60869a"' : 'data-bs-target="#xs-injectables-links-module-ConfigModule-8157672d4742424b8abfdf3fc3879a399fd982eb54f6ea8425f548b4dc37f638dbd85b8c85b0128e8b6de001dc92ef3a6dd63ac133bddf862b13eea44f60869a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigModule-8157672d4742424b8abfdf3fc3879a399fd982eb54f6ea8425f548b4dc37f638dbd85b8c85b0128e8b6de001dc92ef3a6dd63ac133bddf862b13eea44f60869a"' :
                                        'id="xs-injectables-links-module-ConfigModule-8157672d4742424b8abfdf3fc3879a399fd982eb54f6ea8425f548b4dc37f638dbd85b8c85b0128e8b6de001dc92ef3a6dd63ac133bddf862b13eea44f60869a"' }>
                                        <li class="link">
                                            <a href="injectables/ConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HelperModule.html" data-type="entity-link" >HelperModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HelperModule-aabccc589b760e1ec0a17b643a022c5621e76da6177342dce4f0e0c74de7a88e0c87fd80a48fa1d523d111380474b1005ef215131050c5e8ef6b0cb8424abfaa"' : 'data-bs-target="#xs-injectables-links-module-HelperModule-aabccc589b760e1ec0a17b643a022c5621e76da6177342dce4f0e0c74de7a88e0c87fd80a48fa1d523d111380474b1005ef215131050c5e8ef6b0cb8424abfaa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HelperModule-aabccc589b760e1ec0a17b643a022c5621e76da6177342dce4f0e0c74de7a88e0c87fd80a48fa1d523d111380474b1005ef215131050c5e8ef6b0cb8424abfaa"' :
                                        'id="xs-injectables-links-module-HelperModule-aabccc589b760e1ec0a17b643a022c5621e76da6177342dce4f0e0c74de7a88e0c87fd80a48fa1d523d111380474b1005ef215131050c5e8ef6b0cb8424abfaa"' }>
                                        <li class="link">
                                            <a href="injectables/BuildPagingMetaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BuildPagingMetaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StringHelper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StringHelper</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImageModule.html" data-type="entity-link" >ImageModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ImageModule-97c936c5dc5d21d9df8444c5136cc7b3ef50c7bc3ab6272fd1d6a1c9534493e082a58cb50351e0e1c551c74c482732662db8d467918b0507cac87c945b92a56b"' : 'data-bs-target="#xs-injectables-links-module-ImageModule-97c936c5dc5d21d9df8444c5136cc7b3ef50c7bc3ab6272fd1d6a1c9534493e082a58cb50351e0e1c551c74c482732662db8d467918b0507cac87c945b92a56b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ImageModule-97c936c5dc5d21d9df8444c5136cc7b3ef50c7bc3ab6272fd1d6a1c9534493e082a58cb50351e0e1c551c74c482732662db8d467918b0507cac87c945b92a56b"' :
                                        'id="xs-injectables-links-module-ImageModule-97c936c5dc5d21d9df8444c5136cc7b3ef50c7bc3ab6272fd1d6a1c9534493e082a58cb50351e0e1c551c74c482732662db8d467918b0507cac87c945b92a56b"' }>
                                        <li class="link">
                                            <a href="injectables/ImageMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImageMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ImageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrderModule.html" data-type="entity-link" >OrderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' : 'data-bs-target="#xs-controllers-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' :
                                            'id="xs-controllers-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' }>
                                            <li class="link">
                                                <a href="controllers/OrderAdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrderController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' : 'data-bs-target="#xs-injectables-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' :
                                        'id="xs-injectables-links-module-OrderModule-c65c63ea5b13f088d8d5bb51747907c80e78ddb8e7d5f74e147c1d487675d4adb32e01e8459919767417e8e27bffbfed072d171126b8a319e190f36fb4058b7d"' }>
                                        <li class="link">
                                            <a href="injectables/OrderRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link" >PaymentModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PaypalModule.html" data-type="entity-link" >PaypalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' : 'data-bs-target="#xs-controllers-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' :
                                            'id="xs-controllers-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' }>
                                            <li class="link">
                                                <a href="controllers/PaypalController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaypalController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' : 'data-bs-target="#xs-injectables-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' :
                                        'id="xs-injectables-links-module-PaypalModule-7be06ef48fca94c6a947132e5771fd34910238f6abc666c0b3d6a5210f3db3e4bf1f3726bd4e5046551f015331d5825863ea27071fe3bb3791a5b66baab22831"' }>
                                        <li class="link">
                                            <a href="injectables/PaypalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaypalService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductModule.html" data-type="entity-link" >ProductModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' : 'data-bs-target="#xs-controllers-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' :
                                            'id="xs-controllers-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' }>
                                            <li class="link">
                                                <a href="controllers/ProductController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' : 'data-bs-target="#xs-injectables-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' :
                                        'id="xs-injectables-links-module-ProductModule-ac84452649fab327d9e7862010f819039a1f415b5253920620d382b295c853a9375f2389c03de3773abac4021c5c5f470fac7f4e634aeaab0274616e58a31cbf"' }>
                                        <li class="link">
                                            <a href="injectables/ProductDetailMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductDetailMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductDetailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductDetailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoleModule.html" data-type="entity-link" >RoleModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RoleModule-99b1ee4b7f6fc4c4a1056634a10cc7b4c110f3a590651aeff1eaa679e1d9a0e919c64341f6c808e57d529256560db842f9ae322b8451eac5e3a2f1d9a0e19615"' : 'data-bs-target="#xs-injectables-links-module-RoleModule-99b1ee4b7f6fc4c4a1056634a10cc7b4c110f3a590651aeff1eaa679e1d9a0e919c64341f6c808e57d529256560db842f9ae322b8451eac5e3a2f1d9a0e19615"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoleModule-99b1ee4b7f6fc4c4a1056634a10cc7b4c110f3a590651aeff1eaa679e1d9a0e919c64341f6c808e57d529256560db842f9ae322b8451eac5e3a2f1d9a0e19615"' :
                                        'id="xs-injectables-links-module-RoleModule-99b1ee4b7f6fc4c4a1056634a10cc7b4c110f3a590651aeff1eaa679e1d9a0e919c64341f6c808e57d529256560db842f9ae322b8451eac5e3a2f1d9a0e19615"' }>
                                        <li class="link">
                                            <a href="injectables/RoleMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' : 'data-bs-target="#xs-controllers-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' :
                                            'id="xs-controllers-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' }>
                                            <li class="link">
                                                <a href="controllers/UserAdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' : 'data-bs-target="#xs-injectables-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' :
                                        'id="xs-injectables-links-module-UserModule-335f855a067601e0d4c76463e3bc86774f449645d39455df89cc60b04fcd675f5c0f5b1c39046fdfe5767668c8467c7679bbaddd02a4ca1f7e7bcef07d6343ac"' }>
                                        <li class="link">
                                            <a href="injectables/UserMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WishlistModule.html" data-type="entity-link" >WishlistModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' : 'data-bs-target="#xs-controllers-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' :
                                            'id="xs-controllers-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' }>
                                            <li class="link">
                                                <a href="controllers/WishlistController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WishlistController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' : 'data-bs-target="#xs-injectables-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' :
                                        'id="xs-injectables-links-module-WishlistModule-71abb08778ea404920944f7f3ff272cb839c990e317ac2f8ebd08c677196e0e8a57654df34d1e89793231b4c864eec9c8ac8008b0c393d1aa7bcfb8da33fea24"' }>
                                        <li class="link">
                                            <a href="injectables/WishlistItemMapper.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WishlistItemMapper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WishlistService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WishlistService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BrandController.html" data-type="entity-link" >BrandController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CartController.html" data-type="entity-link" >CartController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CheckoutController.html" data-type="entity-link" >CheckoutController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OrderAdminController.html" data-type="entity-link" >OrderAdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OrderController.html" data-type="entity-link" >OrderController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PaypalController.html" data-type="entity-link" >PaypalController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductController.html" data-type="entity-link" >ProductController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserAdminController.html" data-type="entity-link" >UserAdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/WishlistController.html" data-type="entity-link" >WishlistController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/BrandEntity.html" data-type="entity-link" >BrandEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CartDetailEntity.html" data-type="entity-link" >CartDetailEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CartEntity.html" data-type="entity-link" >CartEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CategoryEntity.html" data-type="entity-link" >CategoryEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ImageEntity.html" data-type="entity-link" >ImageEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OrderDetailEntity.html" data-type="entity-link" >OrderDetailEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OrderEntity.html" data-type="entity-link" >OrderEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PaymentEntity.html" data-type="entity-link" >PaymentEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductDetailsEntity.html" data-type="entity-link" >ProductDetailsEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductEntity.html" data-type="entity-link" >ProductEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductImageEntity.html" data-type="entity-link" >ProductImageEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RoleEntity.html" data-type="entity-link" >RoleEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserAuthenticationEntity.html" data-type="entity-link" >UserAuthenticationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserDetailEntity.html" data-type="entity-link" >UserDetailEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserImageEntity.html" data-type="entity-link" >UserImageEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/WishlistItemEntity.html" data-type="entity-link" >WishlistItemEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddCodToPaymentMethodColumnInPaymentsTable1768906234248.html" data-type="entity-link" >AddCodToPaymentMethodColumnInPaymentsTable1768906234248</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddProductToCartRequestDto.html" data-type="entity-link" >AddProductToCartRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddProductToWishlistRequestDto.html" data-type="entity-link" >AddProductToWishlistRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthStatusCode.html" data-type="entity-link" >AuthStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseStatusCode.html" data-type="entity-link" >BaseStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/BrandRepository.html" data-type="entity-link" >BrandRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/BrandStatusCode.html" data-type="entity-link" >BrandStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartDetailRepository.html" data-type="entity-link" >CartDetailRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartDetailResponseDto.html" data-type="entity-link" >CartDetailResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartRepository.html" data-type="entity-link" >CartRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartResponseDto.html" data-type="entity-link" >CartResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartStatusCode.html" data-type="entity-link" >CartStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/CatchEverythingFilter.html" data-type="entity-link" >CatchEverythingFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryRepository.html" data-type="entity-link" >CategoryRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryStatusCode.html" data-type="entity-link" >CategoryStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckoutItemResponseDto.html" data-type="entity-link" >CheckoutItemResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBrandsTable1767882774159.html" data-type="entity-link" >CreateBrandsTable1767882774159</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCartDetailsTable1767892621310.html" data-type="entity-link" >CreateCartDetailsTable1767892621310</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCartsTable1767892612331.html" data-type="entity-link" >CreateCartsTable1767892612331</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoriesTable1767882716251.html" data-type="entity-link" >CreateCategoriesTable1767882716251</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateImageTable1767882443764.html" data-type="entity-link" >CreateImageTable1767882443764</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderDetailsTable1767892636312.html" data-type="entity-link" >CreateOrderDetailsTable1767892636312</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderDto.html" data-type="entity-link" >CreateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderItemDto.html" data-type="entity-link" >CreateOrderItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrdersTable1767892631606.html" data-type="entity-link" >CreateOrdersTable1767892631606</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePaymentsTable1767892648322.html" data-type="entity-link" >CreatePaymentsTable1767892648322</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductAdminDto.html" data-type="entity-link" >CreateProductAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductDetailTable1767890475527.html" data-type="entity-link" >CreateProductDetailTable1767890475527</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductImagesTable1767890514331.html" data-type="entity-link" >CreateProductImagesTable1767890514331</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductsTable1767890470644.html" data-type="entity-link" >CreateProductsTable1767890470644</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRolesTable1767869411854.html" data-type="entity-link" >CreateRolesTable1767869411854</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserAdminDto.html" data-type="entity-link" >CreateUserAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserAuthenticationsTable1767885459150.html" data-type="entity-link" >CreateUserAuthenticationsTable1767885459150</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDetailsTable1767883909056.html" data-type="entity-link" >CreateUserDetailsTable1767883909056</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserImagesTable1767885483734.html" data-type="entity-link" >CreateUserImagesTable1767885483734</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUsersTable1767883214964.html" data-type="entity-link" >CreateUsersTable1767883214964</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWishlistItemsTable1767892238514.html" data-type="entity-link" >CreateWishlistItemsTable1767892238514</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordRequestDto.html" data-type="entity-link" >ForgotPasswordRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordResponseDto.html" data-type="entity-link" >ForgotPasswordResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetBrandsWithLimitationRequestDto.html" data-type="entity-link" >GetBrandsWithLimitationRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetBrandsWithLimitationResponseDto.html" data-type="entity-link" >GetBrandsWithLimitationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCartByUserIdRequestDto.html" data-type="entity-link" >GetCartByUserIdRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductDetailByProductIdRequestDto.html" data-type="entity-link" >GetProductDetailByProductIdRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductsPagingByNameRequestDto.html" data-type="entity-link" >GetProductsPagingByNameRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProductsPagingRequest.html" data-type="entity-link" >GetProductsPagingRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetWishlistItemRequestDto.html" data-type="entity-link" >GetWishlistItemRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageEntityResponse.html" data-type="entity-link" >ImageEntityResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageRepository.html" data-type="entity-link" >ImageRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImageStatusCode.html" data-type="entity-link" >ImageStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageResponseDto.html" data-type="entity-link" >MessageResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotUrlValidator.html" data-type="entity-link" >NotUrlValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderFilterDto.html" data-type="entity-link" >OrderFilterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderItemResponseDto.html" data-type="entity-link" >OrderItemResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderResponseDto.html" data-type="entity-link" >OrderResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagingMetaDto.html" data-type="entity-link" >PagingMetaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagingRequestDto.html" data-type="entity-link" >PagingRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagingResponseDto.html" data-type="entity-link" >PagingResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagingStatusCode.html" data-type="entity-link" >PagingStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductAdminEntityResponseDto.html" data-type="entity-link" >ProductAdminEntityResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductAdminResponseDto.html" data-type="entity-link" >ProductAdminResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductDetailRepository.html" data-type="entity-link" >ProductDetailRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductDetailResponseDto.html" data-type="entity-link" >ProductDetailResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductDetailStatusCode.html" data-type="entity-link" >ProductDetailStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductEntityResponseDto.html" data-type="entity-link" >ProductEntityResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductInWishlistResponseDto.html" data-type="entity-link" >ProductInWishlistResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductRepository.html" data-type="entity-link" >ProductRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductStatusCode.html" data-type="entity-link" >ProductStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveProductFromCartRequestDto.html" data-type="entity-link" >RemoveProductFromCartRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveProductFromWishlistDto.html" data-type="entity-link" >RemoveProductFromWishlistDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordRequestDto.html" data-type="entity-link" >ResetPasswordRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordResponseDto.html" data-type="entity-link" >ResetPasswordResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResponseDto.html" data-type="entity-link" >ResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleRepository.html" data-type="entity-link" >RoleRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleResponseDto.html" data-type="entity-link" >RoleResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleStatusCode.html" data-type="entity-link" >RoleStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/SuccessResponseDto.html" data-type="entity-link" >SuccessResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimestampField.html" data-type="entity-link" >TimestampField</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimestampResponseDto.html" data-type="entity-link" >TimestampResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrderDto.html" data-type="entity-link" >UpdateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePaymentAmount1768929010802.html" data-type="entity-link" >UpdatePaymentAmount1768929010802</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductAdminDto.html" data-type="entity-link" >UpdateProductAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateQuantityCartDetailRequestDto.html" data-type="entity-link" >UpdateQuantityCartDetailRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStatusDto.html" data-type="entity-link" >UpdateStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserAdminDto.html" data-type="entity-link" >UpdateUserAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserProfileDto.html" data-type="entity-link" >UpdateUserProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntityResponseDto.html" data-type="entity-link" >UserEntityResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLoginRequestDto.html" data-type="entity-link" >UserLoginRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserProfileResponseDto.html" data-type="entity-link" >UserProfileResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepository.html" data-type="entity-link" >UserRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSignUpRequestDto.html" data-type="entity-link" >UserSignUpRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserStatusCode.html" data-type="entity-link" >UserStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateStatusCode.html" data-type="entity-link" >ValidateStatusCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyOtpRequestDto.html" data-type="entity-link" >VerifyOtpRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyOtpResponseDto.html" data-type="entity-link" >VerifyOtpResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/WishlistItemRepository.html" data-type="entity-link" >WishlistItemRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/WishlistStatusCode.html" data-type="entity-link" >WishlistStatusCode</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthMapper.html" data-type="entity-link" >AuthMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BrandMapper.html" data-type="entity-link" >BrandMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BrandService.html" data-type="entity-link" >BrandService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BuildPagingMetaService.html" data-type="entity-link" >BuildPagingMetaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CartDetailMapper.html" data-type="entity-link" >CartDetailMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CartDetailService.html" data-type="entity-link" >CartDetailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CartMapper.html" data-type="entity-link" >CartMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CartService.html" data-type="entity-link" >CartService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoryService.html" data-type="entity-link" >CategoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CheckoutService.html" data-type="entity-link" >CheckoutService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link" >ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleOauthGuard.html" data-type="entity-link" >GoogleOauthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleStrategy.html" data-type="entity-link" >GoogleStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageMapper.html" data-type="entity-link" >ImageMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageService.html" data-type="entity-link" >ImageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OptionalJwtAuthGuard.html" data-type="entity-link" >OptionalJwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderRepository.html" data-type="entity-link" >OrderRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderService.html" data-type="entity-link" >OrderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaypalService.html" data-type="entity-link" >PaypalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductDetailMapper.html" data-type="entity-link" >ProductDetailMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductDetailService.html" data-type="entity-link" >ProductDetailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductMapper.html" data-type="entity-link" >ProductMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link" >ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleMapper.html" data-type="entity-link" >RoleMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleService.html" data-type="entity-link" >RoleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StringHelper.html" data-type="entity-link" >StringHelper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserAuthenticationRepository.html" data-type="entity-link" >UserAuthenticationRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserMapper.html" data-type="entity-link" >UserMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WishlistItemMapper.html" data-type="entity-link" >WishlistItemMapper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WishlistService.html" data-type="entity-link" >WishlistService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AuthRequest.html" data-type="entity-link" >AuthRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatabaseConfig.html" data-type="entity-link" >DatabaseConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorResponse.html" data-type="entity-link" >ErrorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GoogleConfig.html" data-type="entity-link" >GoogleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GoogleLogin.html" data-type="entity-link" >GoogleLogin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GoogleRequest.html" data-type="entity-link" >GoogleRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HttpConfig.html" data-type="entity-link" >HttpConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThrottlerConfig.html" data-type="entity-link" >ThrottlerConfig</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});