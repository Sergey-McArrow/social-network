'use client'
import { FC, PropsWithChildren, useActionState } from 'react'

type TActionBtnProps = {
  action: (
    _prevState: unknown,
    formData: FormData
  ) => Promise<{ message: string }>
  fields: {
    name: string
    value: string
  }[]
} & PropsWithChildren

export const ActionBtn: FC<TActionBtnProps> = ({
  action,
  children,
  fields,
}) => {
  const [formState, formAction, isPending] = useActionState(action, null)
  // console.log({ fields })

  return (
    <form action={formAction} className="relative">
      {fields?.map((f) => (
        <input key={f.name} type="hidden" name={f.name} value={f.value} />
      ))}
      <button type="submit" disabled={isPending}>
        {children}
      </button>
      {formState?.message.startsWith('Error') && (
        <p className="absolute bottom-full left-0 w-max text-xs font-medium text-red-500">
          {formState.message}
        </p>
      )}
    </form>
  )
}
