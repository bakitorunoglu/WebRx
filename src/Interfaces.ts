///<reference path="../node_modules/rx/ts/rx.all.d.ts" />

module wx {
   /**
    * Dependency Injector and service locator
    * @interface 
    **/
    export interface IInjector {
        register(key: string, factory: Array<any>, singleton?: boolean): IInjector;
        register(key: string, factory: () => any, singleton?: boolean): IInjector;
        register(key: string, instance: any): IInjector;

        get<T>(key: string, args?: any): T;
        resolve<T>(iaa: Array<any>, args?: any): T;
    }

   /**
    * The WeakMap object is a collection of key/value pairs in which the keys are objects and the values can be arbitrary values. The keys are held using weak references.
    * @interface 
    **/
    export interface IWeakMap<TKey extends Object, T> {
        set(key: TKey, value: T): void;
        get(key: TKey): T;
        has(key: TKey): boolean;
        delete(key: TKey): void;
        isEmulated: boolean;
    }

   /**
    * The Set object lets you store unique values of any type, whether primitive values or object references.
    * @interface 
    **/
    export interface ISet<T> {
        add(value: T): ISet<T>;
        has(key: T): boolean;
        delete(key: T): boolean;
        clear(): void;
        forEach(callback: (T) => void, thisArg?): void;
        size: number;
        isEmulated: boolean;
    }

    /**
    * Represents an engine responsible for converting arbitrary text fragements into a collection of Dom Nodes
    * @interface 
    **/
    export interface ITemplateEngine {
        parse(templateSource: string): Node[];
    }

    /**
    * Represents a collection of objects that can be individually accessed by index.
    * @interface 
    **/
    export interface IReadOnlyList<T> {
        length: number;
        get(index: number): T;
    }

    /**
    * Represents a collection of objects that can be individually accessed by index.
    * @interface 
    **/
    export interface IList<T> extends IReadOnlyList<T> {
        set(index: number, item: T);
        isReadOnly: boolean;
        add(item: T): void;
        push(item: T): void;
        clear(): void;
        contains(item: T): boolean;
        remove(item: T): boolean;
        indexOf(item: T): number;
        insert(index: number, item: T): void;
        removeAt(index: number): void;
    }

    /**
    * IObservableProperty combines a function signature for value setting and getting with
    * observables for monitoring value changes
    * @interface 
    **/
    export interface IObservableProperty<T> extends Rx.IDisposable {
        (newValue: T): void;
        (): T;
        changing: Rx.Observable<T>;
        changed: Rx.Observable<T>;
        source?: Rx.Observable<T>;
    }

    /**
    * This interface is implemented by RxUI objects which are given
    * IObservables as input - when the input IObservables OnError, instead of
    * disabling the RxUI object, we catch the Rx.Observable and pipe it into
    * this property.
    *
    * Normally this Rx.Observable is implemented with a ScheduledSubject whose
    * default Observer is wx.app.defaultExceptionHandler - this means, that if
    * you aren't listening to thrownExceptions and one appears, the exception
    * will appear on the UI thread and crash the application.
    * @interface 
    **/
    export interface IHandleObservableErrors {
        /**
        * Fires whenever an exception would normally terminate the app
        * internal state.
        **/
        thrownExceptions: Rx.Observable<Error>; //  { get; }
    }

    /**
    * Encapsulates change notifications published by various IObservableList members
    * @interface 
    **/
   export interface IListChangeInfo<T> {
        items: T[]; // { get; }
        from: number; // { get; }
        to?: number; // { get; }
    }

    /**
    * ICommand represents an ICommand which also notifies when it is
    * executed (i.e. when Execute is called) via IObservable. Conceptually,
    * this represents an Event, so as a result this IObservable should never
    * onComplete or onError.
    * @interface 
    **/
    export interface ICommand<T> extends
        Rx.IDisposable,
        IHandleObservableErrors {
        canExecute(parameter: any): boolean;
        execute(parameter: any): void;

        /**
        * Gets a value indicating whether this instance can execute observable.
        **/
        canExecuteObservable: Rx.Observable<boolean>; //  { get; }

        /**
        * Gets a value indicating whether this instance is executing. This
        * Observable is guaranteed to always return a value immediately (i.e.
        * it is backed by a BehaviorSubject), meaning it is safe to determine
        * the current state of the command via IsExecuting.First()
        **/
        isExecuting: Rx.Observable<boolean>; //  { get; }

        /**
        * Gets an observable that returns command invocation results
        **/
        results: Rx.Observable<T>;

        /**
        * Executes a Command and returns the result asynchronously. This method
        * makes it *much* easier to test Command, as well as create
        * Commands who invoke inferior commands and wait on their results.
        *
        * Note that you **must** Subscribe to the Observable returned by
        * ExecuteAsync or else nothing will happen (i.e. ExecuteAsync is lazy)
        *
        * Note also that the command will be executed, irrespective of the current value
        * of the command's canExecute observable.
        * @return An Observable representing a single invocation of the Command.
        * @param parameter Don't use this.
        **/
        executeAsync(parameter?: any): Rx.Observable<T>;
    }

    /**
    * Provides information about a changed property value on an object
    * @interface 
    **/
   export interface IPropertyChangedEventArgs {
        sender: any; //  { get; private set; }
        propertyName: string;
    }

    /**
    * INotifyListItemChanged provides notifications for collection item updates, ie when an object in
    * a list changes.
    * @interface 
    **/
    export interface INotifyListItemChanged {
        /**
        * Provides Item Changing notifications for any item in collection that
        * implements IReactiveNotifyPropertyChanged. This is only enabled when
        * ChangeTrackingEnabled is set to True.
        **/
        itemChanging: Rx.Observable<IPropertyChangedEventArgs>; // { get; }

        /**
        * Provides Item Changed notifications for any item in collection that
        * implements IReactiveNotifyPropertyChanged. This is only enabled when
        * ChangeTrackingEnabled is set to True.
        **/
        itemChanged: Rx.Observable<IPropertyChangedEventArgs>; //  { get; }

        /**
        * Enables the ItemChanging and ItemChanged properties; when this is
        * enabled, whenever a property on any object implementing
        * IReactiveNotifyPropertyChanged changes, the change will be
        * rebroadcast through ItemChanging/ItemChanged.
        **/
        changeTrackingEnabled: boolean; //  { get; set; }
    }


    /**
    * INotifyListChanged of T provides notifications when the contents
    * of a list are changed (items are added/removed/moved).
    * @interface 
    **/
    export interface INotifyListChanged<T> {
        /**
        * This Observable fires before the list is changing, regardless of reason
        **/
        listChanging: Rx.Observable<boolean>; //  { get; }

        /**
        * This Observable fires after list has changed, regardless of reason
        **/
        listChanged: Rx.Observable<boolean>; //  { get; }

        /**
        * Fires when items are added to the list, once per item added.
        * Functions that add multiple items such addRange should fire this
        * multiple times. The object provided is the item that was added.
        **/
        itemsAdded: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires before an item is going to be added to the list.
        **/
        beforeItemsAdded: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires once an item has been removed from a list, providing the
        * item that was removed.
        **/
        itemsRemoved: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires before an item will be removed from a list, providing
        * the item that will be removed.
        **/
        beforeItemsRemoved: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires before an items moves from one position in the list to
        * another, providing the item(s) to be moved as well as source and destination
        * indices.
        **/
        beforeItemsMoved: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires once one or more items moves from one position in the list to
        * another, providing the item(s) that was moved as well as source and destination
        * indices.
        **/
        itemsMoved: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires before an item is replaced indices.
        **/
        beforeItemReplaced: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires after an item is replaced
        **/
        itemReplaced: Rx.Observable<IListChangeInfo<T>>; //  { get; }

        /**
        * Fires when the list length changes, regardless of reason
        **/
        lengthChanging: Rx.Observable<number>; //  { get; }

        /**
        * Fires when the list length changes, regardless of reason
        **/
        lengthChanged: Rx.Observable<number>; //  { get; }

        /**
        * Fires when the empty state changes, regardless of reason
        **/
        isEmptyChanged: Rx.Observable<boolean>; //  { get; }

        /**
        * This Observable is fired when a shouldReset fires on the list. This
        * means that you should forget your previous knowledge of the state
        * of the collection and reread it.
        *
        * This does *not* mean Clear, and if you interpret it as such, you are
        * Doing It Wrong.
        **/
        shouldReset: Rx.Observable<any>; //  { get; }

        /**
        * Suppresses change notification from the list until the disposable returned by this method is disposed
        **/
        suppressChangeNotifications(): Rx.IDisposable;
    }

    /**
    * IObservableList of T represents a list that can notify when its
    * contents are changed (either items are added/removed, or the object
    * itself changes).
    * @interface 
    **/
    export interface IObservableList<T> extends IList<T>, INotifyListChanged<T>, INotifyListItemChanged {
        isEmpty: IObservableProperty<boolean>; //  { get; }
        addRange(collection: Array<T>): void;
        insertRange(index: number, collection: Array<T>): void;
        move(oldIndex, newIndex): void;
        removeAll(items: Array<T>): void;
        removeRange(index: number, count: number): void;
        sort(comparison: (a: T, b: T) => number): void;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
        every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        reset(): void;
        toArray(): Array<T>;
    }

    /**
    * Data context used in binding operations
    * @interface 
    **/
    export interface IDataContext {
        $data: any;
        $root: any;
        $parent: any;
        $parents: any[];
    }

    /**
    * Extensible Node state
    * @interface 
    **/
    export interface INodeState {
        cleanup: Rx.CompositeDisposable;
        isBound: boolean;   // true of this node has been touched by applyBindings
        model?: any;        // scope model 
    }

    export interface IObjectLiteralToken {
        key?: string;
        unknown?: string;
        value?: string;
    }

    export interface IExpressionFilter {
        (...args: Array<any>): any;
    }

    export interface IExpressionCompilerOptions {
        disallowFunctionCalls?: boolean;
        filters?: { [filterName: string]: IExpressionFilter };
    }

    export interface ICompiledExpression {
        (scope?: any, locals?: any): any;

        literal?: boolean;
        constant?: boolean;
        assign?: (self, value, locals) => any;
    }

    export interface ICompiledExpressionRuntimeHooks {
        readFieldHook?: (o: any, field: any) => any;
        writeFieldHook?: (o: any, field: any, newValue: any) => any;
        readIndexHook?: (o: any, field: any) => any;
        writeIndexHook?: (o: any, field: any, newValue: any) => any;
    }

    export interface IExpressionCompiler {
        compileExpression(src: string, options?: IExpressionCompilerOptions, cache?: { [exp: string]: ICompiledExpression }): ICompiledExpression;
        getRuntimeHooks(locals: any): ICompiledExpressionRuntimeHooks;
        setRuntimeHooks(locals: any, hooks: ICompiledExpressionRuntimeHooks): void;
        parseObjectLiteral(objectLiteralString): Array<IObjectLiteralToken>;
    }

    /**
    * The Dom Manager coordinates everything involving browser DOM-Manipulation
    * @interface 
    **/
    export interface IDomManager {
        /**
        * Applies bindings to the specified node and all of its children using the specified data context 
        * @param {IDataContext} ctx The data context
        * @param {Node} rootNode The node to be bound
        */
        applyBindings(model: any, rootNode: Node): void;

        /**
        * Applies bindings to all the children of the specified node but not the node itself using the specified data context.
        * You generally want to use this method if you are authoring a new binding handler that handles children.
        * @param {IDataContext} ctx The data context
        * @param {Node} rootNode The node to be bound
        */
        applyBindingsToDescendants(ctx: IDataContext, rootNode: Node): void;

        /**
        * Removes and cleans up any binding-related state from the specified node and its descendants.
        * @param {Node} rootNode The node to be cleaned
        */
        cleanNode(rootNode: Node): void;

        /**
        * Removes and cleans up any binding-related state from all the children of the specified node but not the node itself.
        * @param {Node} rootNode The node to be cleaned
        */
        cleanDescendants(rootNode: Node): void;

        /**
        * Stores updated state for the specified node
        * @param {Node} node The target node
        * @param {IBindingState} state The updated node state
        */
        setNodeState(node: Node, state: INodeState): void;

        /**
        * Computes the actual data context starting at the specified node
        * @param {Node} node The node to be bound
        * @return {IDataContext} The data context to evaluate the expression against
        */
        getDataContext(node: Node): IDataContext;

        /**
        * Retrieves the current node state for the specified node
        * @param {Node} node The target node
        */
        getNodeState(node: Node): INodeState;

        /**
        * Initializes a new node state
        * @param {any} model The model 
        */
        createNodeState(model?: any): INodeState;

        /**
        * Returns true if the node is currently bound by one or more binding-handlers
        * @param {Node} node The node to check
        */
        isNodeBound(node: Node): boolean;

        /**
        * Removes any binding-related state from the specified node. Use with care! In most cases you would want to use cleanNode!
        * @param {Node} node The node to clear
        */
        clearNodeState(node: Node);

        /**
        * Compiles a simple string expression or multiple expressions within an object-literal recursively into an expression tree
        * @param {string} value The expression(s) to compile
        */
        compileBindingOptions(value: string, module: IModule): any;

        /**
        * Tokenizes an object-literal into an array of key-value pairs
        * @param {string} value The object literal tokenize
        */
        getObjectLiteralTokens(value: string): Array<IObjectLiteralToken>;

        /**
        * Returns data-binding expressions for a DOM-Node
        * @param {Node} node The node
        */
        getBindingDefinitions(node: Node): Array<{ key: string; value: string }>;

        /**
        * Registers hook that gets invoked whenever a new data-context gets assembled
        * @param {Node} node The node for which the data-context gets assembled
        * @param {IDataContext} ctx The current data-context
        */
        registerDataContextExtension(extension:(node: Node, ctx:IDataContext)=> void);

        /**
        * Evaluates an expression against a data-context and returns the result
        * @param {IExpressionFunc} exp The source expression 
        * @param {IExpressionFunc} evalObs Allows monitoring of expression evaluation passes (for unit testing)
        * @param {IDataContext} The data context to evaluate the expression against
        * @return {any} A value representing the result of the expression-evaluation
        */
        evaluateExpression(exp: ICompiledExpression, ctx: IDataContext): any;

        /**
        * Creates an observable that produces values representing the result of the expression.
        * If any observable input of the expression changes, the expression gets re-evaluated
        * and the observable produces a new value.
        * @param {IExpressionFunc} exp The source expression 
        * @param {IExpressionFunc} evalObs Allows monitoring of expression evaluation passes (for unit testing)
        * @param {IDataContext} The data context to evaluate the expression against
        * @return {Rx.Observable<any>} A sequence of values representing the result of the last evaluation of the expression
        */
        expressionToObservable(exp: ICompiledExpression, ctx: IDataContext, evalObs?: Rx.Observer<any>): Rx.Observable<any>;
    }

    /**
    * Bindings are markers on a DOM element (such as an attribute or comment) that tell 
    * WebRx's DOM compiler to attach a specified behavior to that DOM element or even 
    * transform the element and its children.
    * @interface 
    **/
    export interface IBindingHandler {
        /**
        * Applies the binding to the specified element
        * @param {Node} node The target node
        * @param {any} options The options for the handler
        * @param {IDataContext} ctx The curent data context
        * @param {IDomElementState} state State of the target element
        * @param {IModule} module The module bound to the current binding scope
        */
        applyBinding(node: Node, options: string, ctx: IDataContext, state: INodeState, module: IModule): void;

        /**
        * Configures the handler using a handler-specific options object
        * @param {any} options The handler-specific options 
        */
        configure(options: any): void;

        /**
        * When there are multiple bindings defined on a single DOM element, 
        * sometimes it is necessary to specify the order in which the bindings are applied. 
        */
        priority: number;

        /**
        * If set to true then bindings won't be applied to children
        * of the element such binding is encountered on. Instead
        * the handler will be responsible for that.
        */
        controlsDescendants?: boolean;
    }

    export interface IBindingRegistry {
        binding(name: string, handler: IBindingHandler): IBindingRegistry;
        binding(name: string, handler: string): IBindingRegistry;
        binding(names: string[], handler: IBindingHandler): IBindingRegistry;
        binding(names: string[], handler: string): IBindingRegistry;
        binding(name: string): IBindingHandler;
    }

    export interface IComponentTemplateDescriptor {
        (params: any): string|Node[];  // Factory 
        require?: string;       // Async AMD
        promise?: Rx.IPromise<Node[]>;  // Async Promise
        resolve?: string;       // DI
        element?: string|Node;  // Selector or Node instance
    }

    export interface IComponentViewModelDescriptor {
        (params: any): any;     // Factory 
        require?: string;       // Async AMD loading
        promise?: Rx.IPromise<string>;  // Async Promise
        resolve?: string;       // DI
        instance?: any;         // pre-constructed instance
    }

    export interface IComponent {
        template: string|Node[]|IComponentTemplateDescriptor;
        viewModel?: IComponentViewModelDescriptor;

        preBindingInit?: string;   // name of method on view-model to invoke before bindings get applied
        postBindingInit?: string;  // name of method on view-model to invoke after binding have been applied
    }

    export interface IComponentRegistry {
        component(name: string, handler: IComponent): IComponentRegistry;
        component(name: string, handler: string): IComponentRegistry;
        component(name: string): IComponent;
    }

    export interface IExpressionFilterRegistry {
        filter(name: string, filter: IExpressionFilter): IExpressionFilterRegistry;
        filter(name: string): IExpressionFilter;
        filters(): { [filterName: string]: IExpressionFilter };
    }

    export interface IModule extends IComponentRegistry, IBindingRegistry, IExpressionFilterRegistry {
        name: string;
    }

    export interface IWebRxApp extends IModule {
        defaultExceptionHandler: Rx.Observer<Error>;
        mainThreadScheduler: Rx.IScheduler;
        templateEngine: ITemplateEngine;
        history: IHistory;
    }

    export interface IRoute {
        parse(url): Object;
        stringify(params?: Object): string;
        concat(route: IRoute): IRoute;
        isAbsolute: boolean;
    }

    export interface IRouterStateConfig {
        name: string;
        route?: string|IRoute;   // relative or absolute
        views?: { [view: string]: string|{ component: string; params?: any } };
        params?: any;
        onEnter?: (config: IRouterStateConfig, params?: any)=> void;
        onLeave?: (config: IRouterStateConfig, params?: any) => void;
        //reloadOnSearch?: boolean;
    }

    export interface IRouterState {
        name: string;
        uri: string;
        params: any;
        views: { [view: string]: string|{ component: string; params?: any } };
        onEnter?: (config: IRouterStateConfig, params?: any) => void;
        onLeave?: (config: IRouterStateConfig, params?: any) => void;
    }

    export const enum RouterLocationChangeMode {
        add = 1,
        replace = 2
    }

    export interface IStateChangeOptions {
        /**
        * If true will update the url in the location bar, if false will not.
        **/
        location?: boolean|RouterLocationChangeMode; 

        /**
        * If true will force transition even if the state or params have not changed, aka a reload of the same state. 
        **/
        force?: boolean;
    }

    export interface IHistory {
        onPopState: Rx.Observable<PopStateEvent>;        

        location: Location;
        length: number;
        state: any;
        back(): void;
        forward(): void;
        replaceState(statedata: any, title: string, url?: string): void;
        pushState(statedata: any, title: string, url?: string): void;
    }

    export interface IRouter {
        /**
        * Registers a state configuration under a given state name.
        * @param {IRouterStateConfig} config State configuration to register
        **/
        state(config: IRouterStateConfig): IRouter;

        /**
        * Current state's configuration.
        **/
        current: IObservableProperty<IRouterState>;

        /**
        * Convenience method for transitioning to a new state. IRouter.go calls IRouter.transitionTo internally 
        * but automatically sets options to { location: true, inherit: true, relative: IRouter.current, notify: true }. 
        * This allows you to easily use an absolute or relative to path and specify only the parameters you'd like 
        * to update (while letting unspecified parameters inherit from the currently active ancestor states).
        * @param {string} to Absolute or relative destination state path. 'contact.detail' - will go to the 
        * contact.detail state. '^'  will go to a parent state. '^.sibling' - will go to a sibling state and
        * '.child.grandchild' will go to grandchild state
        * @param {Object} params A map of the parameters that will be sent to the state. 
        * Any parameters that are not specified will be inherited from currently defined parameters. 
        * @param {IStateChangeOptions} options Options controlling how the state transition will be performed
        **/
        go(to: string, params?: Object, options?: IStateChangeOptions): void;    // Rx.Observable<any>

        /**
        * An uri generation method that returns the uri for the given state populated with the given params.
        * @param {string} state Absolute or relative destination state path. 'contact.detail' - will go to the 
        * contact.detail state. '^'  will go to a parent state. '^.sibling' - will go to a sibling state and
        * '.child.grandchild' will go to grandchild state
        * @param {Object} params An object of parameter values to fill the state's required parameters.
        **/
        uri(state: string, params?: {}): string;

        /**
        * A method that force reloads the current state. All resolves are re-resolved, events are not re-fired, 
        * and components reinstantiated.
        **/
        reload(): void;

        /**
        * Returns the state configuration object for any specific state.
        * @param {string} state Absolute state path.
        **/
        get(state: string): IRouterStateConfig;

        /**
        * A method to determine if the current active state is equal to or is the child of the state stateName. 
        * If any params are passed then they will be tested for a match as well. Not all the parameters need 
        * to be passed, just the ones you'd like to test for equality.
        * @param {string} state Absolute state path.
        **/
        includes(state: string, params?: any, options?: any);

        /**
        * Resets internal state configuration to defaults (for unit-testing)
        **/
        reset(): void;
    }


    /**
    * IMessageBus represents an object that can act as a "Message Bus", a
    * simple way for ViewModels and other objects to communicate with each
    * other in a loosely coupled way.
    * 
    * Specifying which messages go where is done via the contract parameter
    **/
    export interface IMessageBus
    {
        /**
        * Registers a scheduler for the type, which may be specified at
        * runtime, and the contract.
        * 
        * If a scheduler is already registered for the specified
        * runtime and contract, this will overrwrite the existing
        * registration.
        * 
        * @param {string} contract A unique string to distinguish messages with
        * identical types (i.e. "MyCoolViewModel")
        **/
        registerScheduler(scheduler: Rx.IScheduler, contract: string): void;

        /**
        * Listen provides an Observable that will fire whenever a Message is
        * provided for this object via RegisterMessageSource or SendMessage.
        * 
        * @param {string} contract A unique string to distinguish messages with
        * identical types (i.e. "MyCoolViewModel")
        **/
        listen<T>(contract: string): Rx.IObservable<T>;

        /**
        * Determines if a particular message Type is registered.
        * @param {string} The type of the message.
        * 
        * @param {string} contract A unique string to distinguish messages with
        * identical types (i.e. "MyCoolViewModel")
        * @return True if messages have been posted for this message Type.
        **/
        isRegistered(contract: string): boolean;

        /**
        * Registers an Observable representing the stream of messages to send.
        * Another part of the code can then call Listen to retrieve this
        * Observable.
        * 
        * @param {string} contract A unique string to distinguish messages with
        * identical types (i.e. "MyCoolViewModel")
        **/
        registerMessageSource<T>(source: Rx.Observable<T>, contract: string): Rx.IDisposable;

        /**
        * Sends a single message using the specified Type and contract.
        * Consider using RegisterMessageSource instead if you will be sending
        * messages in response to other changes such as property changes
        * or events.
        * 
        * @param {T} message The actual message to send
        * @param {string} contract A unique string to distinguish messages with
        * identical types (i.e. "MyCoolViewModel")
        **/
        sendMessage<T>(message: T, contract: string): void;
    }
}

// RxJS extensions

declare module Rx {
    export interface Observable<T> extends IObservable<T> {
        toProperty(initialValue?: T): wx.IObservableProperty<T>;
    }
}
