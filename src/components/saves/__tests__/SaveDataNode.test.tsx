import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactFlowProvider } from '@xyflow/react'
import { NodeDataRow } from '../../../utils/nodeGraphHelpers'
import { SaveDataNode } from '../SaveDataNode'

function renderNode(rows: NodeDataRow[]) {
  return render(
    <ReactFlowProvider>
      <SaveDataNode id='node' data={{ rows, search: '', formatVersion: '', isHovered: true }} />
    </ReactFlowProvider>,
  )
}

describe('<SaveDataNode />', () => {
  it('should not offer to copy an array label row', () => {
    renderNode([{ item: 'value [2]', type: 'array' }])

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should copy the whole value, colons included', async () => {
    const user = userEvent.setup()

    renderNode([{ item: 'value: {"a": "b: c"}', type: 'string' }])

    await user.click(screen.getByRole('button'))

    expect(await navigator.clipboard.readText()).toBe('{"a": "b: c"}')
  })

  it('should copy the stored value, not the indented one', async () => {
    const user = userEvent.setup()

    renderNode([{ item: 'value: {"a":{"b":1}}', type: 'json' }])

    await user.click(screen.getByRole('button'))

    expect(await navigator.clipboard.readText()).toBe('{"a":{"b":1}}')
  })

  it('should indent and colour a json value row', () => {
    renderNode([
      {
        item: 'value: {"skin":"zip","url":"https://talo.dev","level":3,"paid":false}',
        type: 'json',
      },
    ])

    const lines = Array.from(document.querySelectorAll('pre > span')).map((line) => ({
      indent: (line as HTMLElement).style.paddingLeft,
      text: line.textContent,
    }))

    // the key is inline, the document lines are blocks indented as pad
    expect(lines).toStrictEqual([
      { indent: '', text: 'value: ' },
      { indent: '0ch', text: '{' },
      { indent: '2ch', text: '"skin": "zip",' },
      { indent: '2ch', text: '"url": "https://talo.dev",' },
      { indent: '2ch', text: '"level": 3,' },
      { indent: '2ch', text: '"paid": false' },
      { indent: '0ch', text: '}' },
    ])

    const coloured = (className: string) =>
      Array.from(document.querySelectorAll(`span.${className}`)).map((el) => el.textContent)

    expect(coloured('text-sky-300')).toStrictEqual(['"skin"', '"url"', '"level"', '"paid"'])
    expect(coloured('text-orange-300')).toStrictEqual(['"zip"', '"https://talo.dev"'])
    expect(coloured('text-emerald-300')).toStrictEqual(['3'])
    expect(coloured('text-rose-300')).toStrictEqual(['false'])
  })

  it('should indent a keyless json row, as an array item has no key', () => {
    renderNode([{ item: '{\n"level": 3\n}', type: 'json' }])

    const lines = Array.from(document.querySelectorAll('pre > span')).map(
      (line) => `${(line as HTMLElement).style.paddingLeft}|${line.textContent}`,
    )

    expect(lines).toStrictEqual(['0ch|{', '2ch|"level": 3', '0ch|}'])
    expect(document.querySelectorAll('pre span.text-sky-300').length).toBe(1)
    // a lone row is centred, the document must not be
    expect(document.querySelector('pre')?.className).toContain('text-left')
  })

  it('should indent a double encoded json value row', () => {
    renderNode([{ item: 'value: "{\\"a\\":1}"', type: 'json' }])

    const lines = Array.from(document.querySelectorAll('pre > span')).map(
      (line) => `${(line as HTMLElement).style.paddingLeft}|${line.textContent}`,
    )

    expect(lines).toStrictEqual(['|value: ', '0ch|{', '2ch|"a": 1', '0ch|}'])
  })
})
