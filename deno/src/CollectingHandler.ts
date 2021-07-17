import MultiplexHandler from './MultiplexHandler.ts'
import { Handler } from './Parser.ts'

type OptionalFunction = undefined | ((...args: unknown[]) => void)

export class CollectingHandler extends MultiplexHandler {
    public events: [keyof Handler, ...unknown[]][] = []

    constructor(private readonly cbs: Partial<Handler> = {}) {
        super((name, ...args) => {
            this.events.push([name, ...args])
            ;(this.cbs[name] as OptionalFunction)?.(...args)
        })
    }

    onreset(): void {
        this.events = []
        this.cbs.onreset?.()
    }

    restart(): void {
        this.cbs.onreset?.()

        for (const [name, ...args] of this.events) {
            ;(this.cbs[name] as OptionalFunction)?.(...args)
        }
    }
}
