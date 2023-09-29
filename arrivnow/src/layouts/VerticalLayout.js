// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '@src/navigation/vertical'
import clientNav from '@src/navigation/vertical/clientNav.js'
import contractorNav from '@src/navigation/vertical/contractorNav.js'

const VerticalLayout = props => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  const userData = JSON.parse(localStorage.getItem('userData'))
  if (userData.role === 'contractor') {
    return (
      <Layout menuData={contractorNav} {...props}>
        {props.children}
      </Layout>
    )
  } else if (userData.role === 'client') {
    return (
      <Layout menuData={clientNav} {...props}>
        {props.children}
      </Layout>
    )
  } else if (userData.role === 'admin') {
    return (
      <Layout menuData={navigation} {...props}>
        {props.children}
      </Layout>
    )
  }
  
}

export default VerticalLayout
