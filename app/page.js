"use client"
import Image from "next/image";
import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {Box, Modal, Typography, Stack, TextField, Button} from "@mui/material";
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";

const itemEmojis = {
  "apple": "🍎", "banana": "🍌", "orange": "🍊", "lemon": "🍋",
  "watermelon": "🍉", "strawberry": "🍓", "mango": "🥭", "kiwi": "🥝",
  "avocado": "🥑", "tomato": "🍅", "broccoli": "🥦", "cucumber": "🥒",
  "corn": "🌽", "carrot": "🥕", "garlic": "🧄", "onion": "🧅", "potato": "🥔",
  "bread": "🍞", "bagel": "🥯", "cheese": "🧀", "egg": "🥚", "milk": "🥛",
  "chocolate": "🍫", "cookie": "🍪", "doughnut": "🍩", "cake": "🎂", "candy": "🍬"
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const formattedItem = item.toLowerCase().trim();
    const docRef = doc(collection(firestore, 'inventory'), formattedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const formattedItem = item.toLowerCase().trim();
    const docRef = doc(collection(firestore, 'inventory'), formattedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      const {quantity} = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
      bgcolor="white"
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
            borderRadius: "10px"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
              placeholder="Item Name"
            />
            <Button 
              variant="outlined"
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box border="2px solid #f0f0f0" borderRadius="10px" width="1100px" p={3} bgcolor="#f0f0f0">
        <Typography variant="h4" color="#000" textAlign="left" marginTop={2} marginBottom={2.5} fontWeight="bold">
          Pantry Tracker <span role="img" aria-label="cookie">🍪</span>
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} bgcolor="white" p={2} borderRadius="10px">
          <TextField 
            variant="outlined"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{width: '50%', bgcolor: '#ECEFF1', borderRadius: '5px'}}
          />
          <Button 
            variant="contained" 
            onClick={()=>{
              handleOpen()
            }}
            sx={{borderRadius: "10px", bgcolor: "#4CAF50", color: "white"}}
          >
            Add New Item
          </Button>
        </Stack>
        <Box bgcolor="white" borderRadius="10px" p={2} maxHeight="500px" overflow="auto">
          <Box bgcolor="#0D47A1" borderRadius="10px" p={1} mb={2}>
            <Typography variant="h5" color="#fff" textAlign="center" marginTop={2} marginBottom={2}>
              Inventory Items
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="space-between">
            { inventory.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map(({name, quantity})=>(
                <Box 
                  key={name} 
                  width="30%"
                  minHeight="200px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#E3F2FD"
                  padding={5}
                  borderRadius="10px"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h5" color="#0D47A1" textAlign="center" fontWeight="bold">
                      {itemEmojis[name.toLowerCase()] ? itemEmojis[name.toLowerCase()] + ' ' : ''}{name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6" color="#0D47A1" textAlign="center">
                      Quantity:
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={()=>{
                        removeItem(name)
                    }}
                    sx={{bgcolor: "#F44336", color: "white", borderRadius: "5px", minWidth: "40px"}}
                    >
                      -
                    </Button>
                    <Typography variant="h6" color="#0D47A1" textAlign="center">
                      {quantity}
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={()=>{
                        addItem(name)
                    }}
                    sx={{bgcolor: "#4CAF50", color: "white", borderRadius: "5px", minWidth: "40px"}}
                    >
                      +
                    </Button>
                  </Stack>
                </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}


/*
"use client"
import Image from "next/image";
import {useState, useEffect} from "react";
import {firestore} from "@/firebase";
import {Box, Modal, Typography, Stack, TextField, Button} from "@mui/material";
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()){
      const {quantity} = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
      bgcolor="white"
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
            borderRadius: "10px"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            <Button 
              variant="outlined"
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box border="2px solid #f0f0f0" borderRadius="10px" width="1100px" p={3} bgcolor="#f0f0f0">
        <Typography variant="h4" color="#000" textAlign="left" marginTop={2} marginBottom={2.5} fontWeight="bold">
          Pantry Tracker <span role="img" aria-label="apple">🍎</span>
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} bgcolor="white" p={2} borderRadius="10px">
          <TextField 
            variant="outlined"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{width: '50%', bgcolor: '#ECEFF1', borderRadius: '5px'}}
          />
          <Button 
            variant="contained" 
            onClick={()=>{
              handleOpen()
            }}
            sx={{borderRadius: "10px", bgcolor: "#4CAF50", color: "white"}}
          >
            Add New Item
          </Button>
        </Stack>
        <Box bgcolor="white" borderRadius="10px" p={2} maxHeight="500px" overflow="auto">
          <Box bgcolor="#0D47A1" borderRadius="10px" p={1} mb={2}>
            <Typography variant="h5" color="#fff" textAlign="center" marginTop={2} marginBottom={2}>
              Inventory Items
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="space-between">
            { inventory.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map(({name, quantity, imageUrl})=>(
                <Box 
                  key={name} 
                  width="30%"
                  minHeight="200px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#E3F2FD"
                  padding={5}
                  borderRadius="10px"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Image src={imageUrl} alt={name} width={50} height={50} style={{ borderRadius: '50%' }} />
                    <Typography variant="h5" color="#0D47A1" textAlign="center" fontWeight="bold">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6" color="#0D47A1" textAlign="center">
                      Quantity:
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={()=>{
                        removeItem(name)
                    }}
                    sx={{bgcolor: "#F44336", color: "white", borderRadius: "5px", minWidth: "40px"}}
                    >
                      -
                    </Button>
                    <Typography variant="h6" color="#0D47A1" textAlign="center">
                      {quantity}
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={()=>{
                        addItem(name)
                    }}
                    sx={{bgcolor: "#4CAF50", color: "white", borderRadius: "5px", minWidth: "40px"}}
                    >
                      +
                    </Button>
                  </Stack>
                </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
*/