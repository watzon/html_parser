import { assertions, Buffer } from './deps.ts'
import { WritableStream } from './WritableStream.ts'

Deno.test('should decode fragmented unicode characters', () => {
    let result = ''
    const ontext = (text: string) => {
        result = text
    }
    const stream = new WritableStream({ ontext })

    stream.write(Buffer.from('€'))
    stream.end()

    assertions.assertEquals(result, '€')
})
