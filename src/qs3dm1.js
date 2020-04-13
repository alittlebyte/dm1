//main
class License{
	constructor(model,view){
		this.model = model
		this.view = view		
	}
}

//model
class LicenseModel extends License{
	sendJSONRequest(){
		return axios.get("./src/dm1.json")
	}
}

//view
class LicenseView extends License{
	constructor(){
		super()

		this.license = document.querySelector("#license")	
		this.licenseOuter = document.createElement("div")

		this.licenseOuter.setAttribute("class","frame")

		this.license.appendChild(this.licenseOuter)
	}


	renderLicense(viewModel){
		//combobox
		let licenseHolder = document.createElement("form")

		viewModel.map(el => {			
			let licensePlan = document.createElement("div")
			let licenseBtn = document.createElement("input")
			let licenseLabel = document.createElement("label")
			let licenseTitle = document.createElement("p")
			let licensePrice = document.createElement("p")

			licensePlan.setAttribute("class","radio_holder")
			licenseBtn.setAttribute("type","radio")
			licenseBtn.setAttribute("class","radio_custom_btn")
			licenseBtn.setAttribute("name","radio_group")
			licenseBtn.setAttribute("id","radio_" + el.price)
			licenseLabel.setAttribute("for", "radio_" + el.price)
			licenseLabel.setAttribute("class","radio_custom_label")
			licenseTitle.setAttribute("class","radio_label_title")
			licenseTitle.textContent = el.title
			licensePrice.setAttribute("class","radio_label_text")
			licensePrice.textContent = `$ ${el.price} per license`

			licenseLabel.appendChild(licenseTitle)
			licenseLabel.appendChild(licensePrice)
			licensePlan.appendChild(licenseBtn)
			licensePlan.appendChild(licenseLabel)
			licenseHolder.appendChild(licensePlan)
			this.licenseOuter.appendChild(licenseHolder)
		})

		//lines and select	
		let line = document.createElement("hr")
		let newLine = line.cloneNode()

		this.licenseOuter.appendChild(line)

		let licenseAmount = document.createElement("div")
		let licenseLabel = document.createElement("label")
		let licenseSelect = document.createElement("select")
		let amount = [1,2,3,4,5,6,7,8,9,10]

		licenseAmount.setAttribute("class","amount_holder")
		licenseLabel.setAttribute("for","license_amount")
		licenseLabel.setAttribute("class","amount_text")
		licenseLabel.textContent = "Number of licenses: "
		licenseSelect.setAttribute("id","license_amount")

		amount.map(el => {
			let licenseOption = document.createElement("option")

			licenseOption.setAttribute("value",el)
			licenseOption.textContent = el

			licenseSelect.append(licenseOption)
		})

		licenseAmount.appendChild(licenseLabel)
		licenseAmount.appendChild(licenseSelect)
		this.licenseOuter.appendChild(licenseAmount)
		this.licenseOuter.appendChild(newLine)

		//total
		let countHolder = document.createElement("div")
		let countText = document.createElement("p")
		let countNumber = document.createElement("p")
		let countCurrency = document.createElement("p")

		countHolder.setAttribute("class","factor_holder")
		countText.setAttribute("class","factor_text")
		countText.textContent = "TOTAL:"
		countNumber.setAttribute("class","factor_number")
		countNumber.textContent = "$13"
		countCurrency.setAttribute("class","factor_currency")
		countCurrency.textContent = "US"

		countHolder.appendChild(countText)
		countHolder.appendChild(countNumber)
		countHolder.appendChild(countCurrency)
		this.licenseOuter.appendChild(countHolder)		

		//button
		let purchaseBtn = document.createElement("a")

		purchaseBtn.setAttribute("href","#/")
		purchaseBtn.setAttribute("class","purchase_button")
		purchaseBtn.textContent = "BUY NOW"

		this.licenseOuter.appendChild(purchaseBtn)

		//plan
		let planHolder = document.createElement("div")	
		let planText = document.createElement("p")
		let planNumber = document.createElement("p")

		planHolder.setAttribute("class","plan_holder")
		planText.setAttribute("class","plan_text")
		planText.textContent = "Selected plan:"
		planNumber.setAttribute("class","plan_number")
		planNumber.textContent = "#1"

		planHolder.appendChild(planText)
		planHolder.appendChild(planNumber)
		this.licenseOuter.appendChild(planHolder)
	}
}

//controller
class LicenseController extends License{
	constructor(model, view){
		super(model,view)

		this.getJSONAndRender(this.model.sendJSONRequest())
		this.attachListeners()
	}

	async getJSONAndRender(data){
		let JSONData = await data
		this.view.renderLicense(JSONData.data)
		document.querySelector(".radio_custom_btn").checked = true
	}

	attachListeners(){
		document.addEventListener("change", e => {
			if (e.target.matches(".radio_custom_btn:checked, #license_amount"))
				this.getFactors()	
			if (e.target.matches(".radio_custom_btn:checked"))
				this.changePlan(e.target.labels[0].innerText.substr(13,2))
		})
		document.addEventListener("click", e => {
			if (e.target.matches(".purchase_button")){
				e.preventDefault()
				this.purchaseMsg()
			}
		})
	}

	getFactors(){
		let radio = document.querySelector(".radio_custom_btn:checked")
		let select = document.querySelector("#license_amount")
		let input = document.querySelector(".factor_number")
		let radioValue = radio ? radio.getAttribute("id").split("_").pop() : 13
		let selectValue = select ? select.value : 1
		input.textContent = `$${radioValue*selectValue}`
	}

	changePlan(planValue){
		let plan = document.querySelector(".plan_number")
		plan.textContent = planValue
	}

	purchaseMsg(){
		let copyAmount = document.querySelector("#license_amount").value
		let selectedPlan = document.querySelector(".radio_custom_btn:checked").labels[0].innerText.substr(13,2)
		let subTotal = document.querySelector(".factor_number").textContent
		alert(`You bought ${copyAmount} copies of license ${selectedPlan} for a total of ${subTotal}!`)
	}
}

//app
new LicenseController(new LicenseModel(), new LicenseView())