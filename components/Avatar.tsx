interface AvatarProps {
  name: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Avatar({
  name,
  avatarUrl,
  size = 'md',
}: AvatarProps) {
  // Gerar cor consistente baseado no nome
  const getColorFromName = (str: string): string => {
    const colors = [
      '#EF4444', // red
      '#F97316', // orange
      '#EAB308', // yellow
      '#22C55E', // green
      '#06B6D4', // cyan
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
    ]
    const hash = str
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  // Obter iniciais
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const bgColor = getColorFromName(name)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      {initials}
    </div>
  )
}
