const { widget } = figma
const { useSyncedState, useEffect, usePropertyMenu, AutoLayout, Text, Input } = widget

function FeedbackWidget() {
  let origin = ''
  const [settingsOpen, setSettingsOpen] = useSyncedState<boolean>('settignsOpen', true)
  const [title, setTitle] = useSyncedState<string>('title', 'Was this page helpful?')
  const [description, setDescription] = useSyncedState<string>('description', 'We use this feedback to improve our guidelines.')
  const [url, setUrl] = useSyncedState<string>('url', '')
  const [feedback, setFeedback] = useSyncedState<string>('feedback', '')
  const [comment, setComment] = useSyncedState<string>('comment', '')
  const [error, setError] = useSyncedState<string>('error', '')
  const urlRegex = new RegExp("^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$")

  useEffect(() => {
    if (figma.editorType === 'figjam') {
      origin = figma.currentPage.parent!.name
    } else {
      origin = figma.currentPage.parent!.name + ' / ' + figma.currentPage.name
    }

    figma.ui.onmessage = async (response) => {
      if (response.type === 'success') {
        figma.notify('Feedback sent, thank you!')
        resetStates()
        figma.closePlugin()
      } else if (response.type === 'urlError') {
        setError('Something went wrong. There\'s probably problems with CORS. Your hook should allow access from any origin.')
        figma.closePlugin()
      } else if (response.type === 'requestError') {
        setError('Something went wrong. Please try again. If this keeps happening there\'s problems with the POST request.')
        figma.closePlugin()
      }
    }

    // Close widget when the page has changed
    figma.on('currentpagechange', () => {
      figma.closePlugin()
    })
  })

  interface ButtonProps extends HasChildrenProps {
    label: string
    onClick?: () => void
  }

  function ActiveButton({ label, onClick }: ButtonProps) {
    return (
      <AutoLayout
        name='ActiveButton'
        direction='horizontal'
        horizontalAlignItems='center'
        verticalAlignItems='center'
        height={40}
        width='fill-parent'
        padding={{
          vertical: 8,
          horizontal: 16,
        }}
        fill='#dbeafe'
        stroke='#93c5fd'
        cornerRadius={8}
        hoverStyle={{
          fill: '#bfdbfe',
        }}
        onClick={onClick}
      >
        <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#1d4ed8' width='fill-parent' horizontalAlignText='center'>
          {label}
        </Text>
      </AutoLayout>
    )
  }

  function SecondaryButton({ label, onClick }: ButtonProps) {
    return (
      <AutoLayout
        name='SecondaryButton'
        direction='horizontal'
        horizontalAlignItems='center'
        verticalAlignItems='center'
        height={40}
        width='fill-parent'
        padding={{
          vertical: 8,
          horizontal: 16,
        }}
        fill='#ffffff'
        stroke='#d1d5db'
        cornerRadius={8}
        hoverStyle={{
          fill: '#f3f4f6',
        }}
        onClick={onClick}
      >
        <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#1f2937' width='fill-parent' horizontalAlignText='center'>
          {label}
        </Text>
      </AutoLayout>
    )
  }

  function PrimaryButton({ label, onClick }: ButtonProps) {
    return (
      <AutoLayout
        name='PrimaryButton'
        direction='horizontal'
        horizontalAlignItems='center'
        verticalAlignItems='center'
        height={40}
        width='fill-parent'
        padding={{
          vertical: 8,
          horizontal: 16,
        }}
        fill='#2563eb'
        cornerRadius={8}
        hoverStyle={{
          fill: '#1d4ed8',
        }}
        onClick={onClick}
      >
        <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#ffffff' width='fill-parent' horizontalAlignText='center'>
          {label}
        </Text>
      </AutoLayout>
    )
  }

  function DisabledButton({ label, onClick }: ButtonProps) {
    return (
      <AutoLayout
        name='DisabledButton'
        direction='horizontal'
        horizontalAlignItems='center'
        verticalAlignItems='center'
        height={40}
        width='fill-parent'
        padding={{
          vertical: 8,
          horizontal: 16,
        }}
        fill='#e5e7eb'
        cornerRadius={8}
        hoverStyle={{
          fill: '#e5e7eb',
        }}
        onClick={onClick}
      >
        <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#6b7280' width='fill-parent' horizontalAlignText='center'>
          {label}
        </Text>
      </AutoLayout>
    )
  }

  function resetStates() {
    setFeedback('')
    setComment('')
    setError('')
  }

  async function submitHandler() {
    await new Promise((resolve) => {
      setError('')
      figma.showUI(__html__, { visible: false })
      figma.ui.postMessage({
        data: {
          date: new Date().toISOString(),
          feedback: feedback,
          comment: comment,
          origin: origin,
        }, 
        url: url,
      })
    })
  }

  usePropertyMenu(
    [
     !settingsOpen && {
        itemType: 'action',
        tooltip: 'Edit widget',
        propertyName: 'edit',
      },
    ].filter(i => !!i) as WidgetPropertyMenuItem[],
    () => {
      setSettingsOpen(true)
    },
  )

  return (
    <AutoLayout
      name='FeedbackWidget'
      direction='vertical'
      height='hug-contents'
      horizontalAlignItems='center'
      width={400}
      fill='#ffffff'
      padding={32}
      effect={{
        type: 'drop-shadow',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 4 },
        blur: 8,
      }}
      spacing={24}
      cornerRadius={12}
    >
      {settingsOpen && (
        <>
          <AutoLayout
            name='Container'
            direction='vertical'
            horizontalAlignItems='center'
            verticalAlignItems='center'
            height='hug-contents'
            width='fill-parent'
            spacing={8}
          >
            <Text fontFamily='Inter' fontWeight={400} lineHeight={32} width='fill-parent' fontSize={25} fill='#1f2937' horizontalAlignText='center'>
              Feedback Widget
            </Text>
            <Text fontFamily='Inter' fontWeight={400} lineHeight={20} width='fill-parent' fontSize={14} fill='#6b7280' horizontalAlignText='center'>
              A simple setup is required before use.
            </Text>
          </AutoLayout>
          <AutoLayout name='TextField' direction='vertical' spacing={8} width='fill-parent'>
            <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#1f2937' width='fill-parent'>
              Title
            </Text>
            <Input
              name='Input'
              value={title}
              placeholder='Title'
              onTextEditEnd={(e) => {
                setTitle(e.characters)
              }}
              fontSize={15}
              fill='#444444'
              width='fill-parent'
              inputFrameProps={{
                fill: '#FFFFFF',
                stroke: '#DDDDDD',
                cornerRadius: 8,
                padding: 12,
              }}
              inputBehavior='multiline'
            />
          </AutoLayout>
          <AutoLayout name='TextField' direction='vertical' spacing={8} width='fill-parent'>
            <AutoLayout name='Label' direction='horizontal' spacing={2} width='fill-parent'>
              <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#1f2937'>
                Description
              </Text>
              <Text fontFamily='Inter' fontWeight={400} lineHeight={20} fontSize={14} fill='#6b7280'>
                (optional)
              </Text>
            </AutoLayout>
            <Input
              name='Input'
              value={description}
              placeholder='Description'
              onTextEditEnd={(e) => {
                setDescription(e.characters)
              }}
              fontSize={15}
              fill='#444444'
              width='fill-parent'
              inputFrameProps={{
                fill: '#FFFFFF',
                stroke: '#DDDDDD',
                cornerRadius: 8,
                padding: 12,
              }}
              inputBehavior='multiline'
            />
          </AutoLayout>
          <AutoLayout name='TextField' direction='vertical' spacing={8} width='fill-parent'>
            <AutoLayout name='Label' direction='horizontal' spacing={2} width='fill-parent'>
              <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#1f2937'>
                Webhook URL
              </Text>
              <Text fontFamily='Inter' fontWeight={400} lineHeight={20} fontSize={14} fill='#6b7280'>
                (must contain http(s)://)
              </Text>
            </AutoLayout>
            <Input
              name='Input'
              value={url}
              placeholder='Where to send the JSON?'
              onTextEditEnd={(e) => {
                setUrl(e.characters)
              }}
              fontSize={15}
              fill='#444444'
              width='fill-parent'
              inputFrameProps={{
                fill: '#FFFFFF',
                stroke: '#DDDDDD',
                cornerRadius: 8,
                padding: 12,
              }}
              inputBehavior='multiline'
            />
          </AutoLayout>

          {(url !== '' && urlRegex.test(url) === true)
            ? <PrimaryButton label='Setup widget' onClick={() => {
                setSettingsOpen(false)
                resetStates()
              }}></PrimaryButton>
            : <DisabledButton label='Setup widget'></DisabledButton>
          }
        </>
      )}
      {!settingsOpen && (
        <>
          <AutoLayout
            name='Container'
            direction='vertical'
            horizontalAlignItems='center'
            verticalAlignItems='center'
            height='hug-contents'
            width='fill-parent'
            spacing={8}
          >
            <Text fontFamily='Inter' fontWeight={400} lineHeight={32} width='fill-parent' fontSize={25} fill='#1f2937' horizontalAlignText='center'>
              {title === ''
                ? 'Was this page helpful?'
                : title
              }
            </Text>
            {description !== '' && (  
              <Text fontFamily='Inter' fontWeight={400} lineHeight={20} width='fill-parent' fontSize={14} fill='#6b7280' horizontalAlignText='center'>
                {description}
              </Text>
            )}
          </AutoLayout>
          <AutoLayout
            name='Container'
            direction='horizontal'
            horizontalAlignItems='center'
            verticalAlignItems='center'
            height='hug-contents'
            width='fill-parent'
            spacing={8}
          >
            {feedback === '' && (
              <>
                <SecondaryButton label='Yes' onClick={() => setFeedback('positive')}></SecondaryButton>
                <SecondaryButton label='No' onClick={() => setFeedback('negative')}></SecondaryButton>
              </>
            )}

            {feedback === 'positive' && (
              <>
                <ActiveButton label='Yes' onClick={() => {
                  resetStates()
                }}></ActiveButton>
                <SecondaryButton label='No' onClick={() => setFeedback('negative')}></SecondaryButton>
              </>
            )}

            {feedback === 'negative' && (
              <>
                <SecondaryButton label='Yes' onClick={() => setFeedback('positive')}></SecondaryButton>
                <ActiveButton label='No' onClick={() => {
                  resetStates()
                }}></ActiveButton>
              </>
            )}
          </AutoLayout>
          
          {feedback !== '' && (
            <>
              <AutoLayout name='TextField' direction='vertical' spacing={8} width='fill-parent'>
                <AutoLayout name='Label' direction='horizontal' spacing={2} width='fill-parent'>
                  <Text fontFamily='Inter' fontWeight={600} lineHeight={20} fontSize={14} fill='#1f2937'>
                    Can tell us more?
                  </Text>
                  <Text fontFamily='Inter' fontWeight={400} lineHeight={20} fontSize={14} fill='#6b7280'>
                    (optional)
                  </Text>
                </AutoLayout>
                <Input
                  name='Input'
                  value={comment}
                  placeholder='Share your feedback here...'
                  onTextEditEnd={(e) => {
                    setComment(e.characters)
                  }}
                  fontSize={15}
                  fill='#444444'
                  width='fill-parent'
                  inputFrameProps={{
                    fill: '#FFFFFF',
                    stroke: '#DDDDDD',
                    cornerRadius: 8,
                    padding: 12,
                  }}
                  inputBehavior='multiline'
                />
              </AutoLayout>

              <AutoLayout name='Container' direction='vertical' spacing={8} width='fill-parent'>
                <PrimaryButton label='Send feedback' onClick={() => submitHandler()}></PrimaryButton>
                <Text fontFamily='Inter' fontWeight={400} lineHeight={22} fontSize={14} fill='#6b7280' width='fill-parent' horizontalAlignText='center'>
                  This feedback is anonymous.
                </Text>
              </AutoLayout>

              {error !== '' && (
                <>
                  <AutoLayout
                    direction='horizontal'
                    horizontalAlignItems='center'
                    verticalAlignItems='center'
                    padding={{
                      vertical: 8,
                      horizontal: 16,
                    }}
                    fill='#fee2e2'
                    cornerRadius={8}
                    width='fill-parent'
                  >
                    <Text fontFamily='Inter' fontWeight={400} lineHeight={22} fontSize={14} fill='#b91c1c' width='fill-parent'>
                      {error}
                    </Text>
                  </AutoLayout>
                </>
              )}
            </>
          )}
        </>
      )}
    </AutoLayout>
  )
}

widget.register(FeedbackWidget)
