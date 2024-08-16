// modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

// modulos internos
const fs = require('fs')

operation()

function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Criar Conta',
          'Depositar',
          'Consultar Saldo',
          'Sacar',
          'Sair'
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']
      if (action === 'Criar Conta') {
        createAccount()
      } else if (action === 'Depositar'){
        deposit()
      } else if (action === 'Consultar Saldo') {
        getAccountBalance()
      } else if (action === 'Sacar') {
        withdraw()
      } else if (action === 'Sair') {
        console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
        process.exit()
      }
    })
    .catch((err) => console.log(err))
}


// Criar conta

function createAccount() {
  console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
  console.log(chalk.green('Defina as opções da sua conta a sequir'))
  buildAccount()
}

function buildAccount() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Digite um nome para a sua conta:',
    },
  ])
  .then((answer) => {
    const accountName = answer['accountName']
    console.log(accountName);

    if (!fs.existsSync('accounts')) {
      fs.mkdirSync('accounts')
    }

    if (accountName.length > 0) {
      if (fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'));     
        buildAccount()
        return
      }
    } else {
      console.log(chalk.bgRed.black('Digite um nome valido.'));
      buildAccount()
      return
    }

    fs.writeFileSync(
      `accounts/${accountName}.json`, 
      '{"balance": 0}',
      function (err) {
        console.log(err);
      },
    )
    console.log(chalk.green('Parabéns, sua conta foi criada!'));
    operation()
  })
  .catch((err) => console.log(err));
}

// Depositar

function deposit() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Digite um nome para a sua conta?',
    },
  ])
  .then((answer) => {
    const accountName = answer['accountName']
    if (!checkAccount(accountName)) {
      return deposit()
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Quanto você deseja depoitar',
      },
    ]).then((answer) => {
      const amount = answer['amount']
      addAmount(accountName, amount)
      operation()
    }).catch(err => console.log(err))
  })
  .catch((err) => console.log(err));
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)){
    console.log(chalk.bgRed.black('Esta conta não existe, escolha outra e tente novamente!'));
    return false
  }

  return true
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if (amount.length === 0) {
    console.log(chalk.bgRed.black('Digite um valor valido e tente novamente!'));
    return deposit()
  }
  
  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
  
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    },
  )

  console.log(chalk.green(`Foi depositado o valor de R$ ${amount} na sua conta!`));
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r',
  })

  return JSON.parse(accountJSON)
}

// Depoistar 

function getAccountBalance() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Quanto o nome da sua conta?',
    },
  ]).then((answer) => {
    const accountName = answer['accountName']

    if (!checkAccount(accountName)) {
      return getAccountBalance()
    }
    
    const accountData = getAccount(accountName)

    console.log(chalk.bgBlue.black(
      `Olá, o saldo da sua conta é de R$ ${accountData.balance}`
    ));

    operation()

  }).catch(err => console.log(err))
}

// Sacar dinheiro
function withdraw() {
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Quanto o nome da sua conta?',
    },
  ]).then((answer) => {
    const accountName = answer['accountName']
    
    if (!checkAccount(accountName)) {
      return withdraw()
    }

    inquirer.prompt([
      {
        name: 'amount',
        message: 'Quanto deseja sacar?',
      },
    ]).then((answer) => {
      const amount = answer['amount']
      
      removeAmount(accountName, amount)
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if (!amount) {
    console.log(chalk.bgRed.black('Digite um valor valido e tente novamente!'));
    return withdraw()
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black('Valor indisponível!'));
    return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    },
  )

  console.log(chalk.green(`Foi realizado um saque de R$ ${amount} da sua conta!`))
  console.log(chalk.green(`Seu saldo atual é de R$ ${accountData.balance}`))
  operation()
}