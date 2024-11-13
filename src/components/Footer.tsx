import Link from './Link'

export default function Footer() {
  return (
    <footer className='relative mt-auto bg-gray-900 px-4 py-8 md:py-12 w-full text-white md:flex justify-center md:space-x-12 lg:space-x-16 xl:space-x-[100px] space-y-4 md:space-y-0 border-t border-gray-700'>
      <div className='space-y-4'>
        <div>
          <strong>&copy; Talo Platform Ltd {new Date().getFullYear()}</strong>
          <p className='mt-2'>Self-funded and independent</p>
          <Link to='https://trytalo.com/about?utm_source=dashboard&utm_medium=footer'>About us</Link>
        </div>

        <div>
          <h3 className='font-semibold'>Contact us</h3>
          <ul className='mt-2 space-y-1'>
            <li><Link to='https://trytalo.com/discord'>Discord</Link></li>
            <li><Link to='mailto:hello@trytalo.com'>Email</Link></li>
            <li><Link to='https://x.com/trytalo'>Twitter</Link></li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className='font-semibold'>Features</h3>
        <ul className='mt-2 space-y-1'>
          <li><Link to='https://trytalo.com/players?utm_source=dashboard&utm_medium=footer'>Player management</Link></li>
          <li><Link to='https://trytalo.com/events?utm_source=dashboard&utm_medium=footer'>Event tracking</Link></li>
          <li><Link to='https://trytalo.com/leaderboards?utm_source=dashboard&utm_medium=footer'>Leaderboards</Link></li>
          <li><Link to='https://trytalo.com/saves?utm_source=dashboard&utm_medium=footer'>Game saves</Link></li>
          <li><Link to='https://trytalo.com/stats?utm_source=dashboard&utm_medium=footer'>Game stats</Link></li>
          <li><Link to='https://trytalo.com/feedback?utm_source=dashboard&utm_medium=footer'>Game feedback</Link></li>
          <li><Link to='https://trytalo.com/live-config?utm_source=dashboard&utm_medium=footer'>Live config</Link></li>
          <li><Link to='https://trytalo.com/open-source?utm_source=dashboard&utm_medium=footer'>Open source</Link></li>
        </ul>
      </div>

      <div className='space-y-4 xl:space-y-0 xl:flex xl:space-x-[100px]'>
        <div>
          <h3 className='font-semibold'>Integrations</h3>
          <ul className='mt-2 space-y-1'>
            <li><Link to='https://trytalo.com/steamworks-integration?utm_source=dashboard&utm_medium=footer'>Steamworks integration</Link></li>
            <li><Link to='https://trytalo.com/unity?utm_source=dashboard&utm_medium=footer'>Unity package</Link></li>
            <li><Link to='https://trytalo.com/godot?utm_source=dashboard&utm_medium=footer'>Godot plugin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className='font-semibold'>Links</h3>
          <ul className='mt-2 space-y-1'>
            <li><Link to='https://github.com/TaloDev'>GitHub</Link></li>
            <li><Link to='https://docs.trytalo.com?utm_source=dashboard&utm_medium=footer'>Docs</Link></li>
            <li><Link to='https://trytalo.com/blog?utm_source=dashboard&utm_medium=footer'>Blog</Link></li>
            <li><Link to='https://trytalo.com/pricing?utm_source=dashboard&utm_medium=footer'>Pricing</Link></li>
            <li><Link to='https://trytalo.com/privacy?utm_source=dashboard&utm_medium=footer'>Privacy</Link></li>
            <li><Link to='https://trytalo.com/terms?utm_source=dashboard&utm_medium=footer'>Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
