import Link from './Link'

export default function Footer() {
  return (
    <footer className='relative mt-auto bg-gray-900 px-4 py-8 md:py-12 w-full text-white md:flex justify-center md:space-x-12 lg:space-x-16 xl:space-x-[100px] space-y-4 md:space-y-0 border-t border-gray-700'>
      <div className='space-y-4'>
        <div>
          <strong>&copy; Talo Platform Ltd {new Date().getFullYear()}</strong>
          <p className='mt-2'>Self-funded and independent</p>
          <Link to='https://trytalo.com/about'>About us</Link>
        </div>

        <div>
          <h3 className='font-semibold'>Contact us</h3>
          <ul className='mt-2 space-y-1'>
            <li><Link to='https://discord.gg/2RWwxXVY3v'>Discord</Link></li>
            <li><Link to='mailto:hello@trytalo.com'>Email</Link></li>
            <li><Link to='https://x.com/trytalo'>Twitter</Link></li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className='font-semibold'>Features</h3>
        <ul className='mt-2 space-y-1'>
          <li><Link to='https://trytalo.com/players'>Player management</Link></li>
          <li><Link to='https://trytalo.com/events'>Event tracking</Link></li>
          <li><Link to='https://trytalo.com/leaderboards'>Leaderboards</Link></li>
          <li><Link to='/https://trytalo.comsaves'>Game saves</Link></li>
          <li><Link to='https://trytalo.com/stats'>Game stats</Link></li>
          <li><Link to='https://trytalo.com/feedback'>Game feedback</Link></li>
          <li><Link to='https://trytalo.com/live-config'>Live config</Link></li>
          <li><Link to='https://trytalo.com/open-source'>Open source</Link></li>
        </ul>
      </div>

      <div className='space-y-4 xl:space-y-0 xl:flex xl:space-x-[100px]'>
        <div>
          <h3 className='font-semibold'>Integrations</h3>
          <ul className='mt-2 space-y-1'>
            <li><Link to='https://trytalo.com/steamworks-integration'>Steamworks integration</Link></li>
            <li><Link to='https://trytalo.com/unity'>Unity package</Link></li>
            <li><Link to='https://trytalo.com/godot'>Godot plugin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className='font-semibold'>Links</h3>
          <ul className='mt-2 space-y-1'>
            <li><Link to='https://github.com/TaloDev'>GitHub</Link></li>
            <li><Link to='https://docs.trytalo.com'>Docs</Link></li>
            <li><Link to='https://trytalo.com/blog'>Blog</Link></li>
            <li><Link to='https://trytalo.com/pricing'>Pricing</Link></li>
            <li><Link to='https://trytalo.com/privacy'>Privacy</Link></li>
            <li><Link to='https://trytalo.com/terms'>Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
